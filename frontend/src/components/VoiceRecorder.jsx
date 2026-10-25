import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Loader2, MessageSquare, Radio, AlertCircle, Edit2, Check, RefreshCw } from 'lucide-react';
import { encodeWAV, resample } from '../utils/audioUtils';

const BACKEND_URL = 'http://localhost:8000';
const TARGET_SAMPLE_RATE = 16000;

const QUICK_TEMPLATES = [
  { label: '49-Day Delay (Rule 167A)', text: 'Mera challan 49 din baad aaya hai. Central Motor Vehicle Rules ke niyam 167A ke tehat notice 15 dino ke andar bhejna mandatory hai. Itni deri ke baad ye challan legally voidable hai.' },
  { label: 'ANPR Camera Misread (Sec 65B)', text: 'Sir photo me car Maruti Dzire dikh rahi hai jabki meri gadi Hyundai i20 hai. Plate pe BB12 likha hai aur mera number 8812 hai. Ye ANPR camera ka clear OCR error hai.' },
  { label: 'Yielded to Ambulance (Sec 194E)', text: 'Dadar circle pe signal red tha lekin mere theek peeche 108 ambulance siren baja rahi thi. Ambulance ko rasta dene ke liye maine car aage badhake zebra crossing pe side me lagai. Section 194E ke tehat emergency vehicle ko rasta dena mandatory hai.' }
];

export default function VoiceRecorder({
  driverStatement,
  driverLang,
  isRecording,
  onToggleRecord,
  onUpdateStatement
}) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(driverStatement || '');

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const processorRef = useRef(null);
  const pcmChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioElemRef = useRef(null);

  useEffect(() => {
    setEditText(driverStatement || '');
  }, [driverStatement]);

  // ─── Waveform Visualizer ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const N = 36, bw = W / N - 2;

      let freqData = null;
      if (analyserRef.current && isRecording) {
        freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(freqData);
      }

      for (let i = 0; i < N; i++) {
        let amp;
        if (freqData && isRecording) {
          amp = Math.max(0.1, (freqData[Math.floor((i / N) * freqData.length)] / 255) * 0.9);
        } else if (isRecording) {
          amp = Math.sin(phase + i * 0.4) * 0.35 + 0.35;
        } else if (isPlayingAudio) {
          amp = Math.sin(phase * 1.5 + i * 0.3) * 0.25 + 0.25;
        } else {
          amp = 0.08;
        }
        const bh = Math.max(3, Math.min(H - 4, amp * H));
        const x = i * (bw + 2), y = (H - bh) / 2;

        ctx.fillStyle = isRecording ? '#f43f5e' : isPlayingAudio ? '#10b981' : '#334155';
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, 2);
        ctx.fill();
      }
      phase += 0.08;
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isRecording, isPlayingAudio]);

  // ─── Audio Recording Pipeline ──────────────────────────────────────────
  const startRecording = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      pcmChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        pcmChunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioCtx.destination);

      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
      onToggleRecord(true);
    } catch (err) {
      setErrorMsg(err.name === 'NotAllowedError' ? 'Microphone permission denied.' : err.message);
    }
  };

  const stopRecording = async () => {
    clearInterval(timerRef.current);
    onToggleRecord(false);

    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (analyserRef.current) { analyserRef.current.disconnect(); analyserRef.current = null; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); }

    const chunks = pcmChunksRef.current;
    const nativeRate = audioCtxRef.current?.sampleRate || 44100;
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') await audioCtxRef.current.close();

    if (!chunks.length) {
      setErrorMsg('No audio detected. Please speak into the mic.');
      return;
    }

    const total = chunks.reduce((s, c) => s + c.length, 0);
    const merged = new Float32Array(total);
    let off = 0;
    for (const c of chunks) { merged.set(c, off); off += c.length; }

    const resampled = resample(merged, nativeRate, TARGET_SAMPLE_RATE);
    const wavBlob = encodeWAV(resampled, TARGET_SAMPLE_RATE);

    setIsTranscribing(true);
    try {
      const form = new FormData();
      form.append('file', wavBlob, 'recording.wav');
      form.append('language_code', 'hi-IN');

      const res = await fetch(`${BACKEND_URL}/api/v1/sarvam/stt`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || `HTTP ${res.status}`);

      const text = data.transcript?.trim();
      if (text && onUpdateStatement) onUpdateStatement(text);
      else if (!text) setErrorMsg('No speech detected. Please speak clearly.');
    } catch (err) {
      setErrorMsg(`Transcription error: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handlePlayVoice = async () => {
    if (isPlayingAudio) {
      audioElemRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }

    const text = (driverStatement || '').trim();
    if (!text) {
      setErrorMsg('No driver statement to play.');
      return;
    }

    setIsPlayingAudio(true);
    setErrorMsg('');
    try {
      const langCode = (driverLang || '').toLowerCase().includes('marathi') ? 'mr-IN'
        : (driverLang || '').toLowerCase().includes('kannada') ? 'kn-IN'
        : 'hi-IN';

      const res = await fetch(`${BACKEND_URL}/api/v1/sarvam/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, target_language_code: langCode, speaker: 'aditya' })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.audios?.length > 0) {
        const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
        audioElemRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => { setIsPlayingAudio(false); setErrorMsg('Playback error.'); };
        await audio.play();
      } else {
        throw new Error('No audio returned.');
      }
    } catch (err) {
      setErrorMsg(err.message);
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="legal-card" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--color-indigo-bg)',
            color: '#818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mic size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
              Driver Voice Statement (Vernacular Ingestion)
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Sarvam Saaras v4 • 16 kHz Mono Speech-to-Text
            </span>
          </div>
        </div>
        <span className="status-chip chip-indigo">
          {driverLang}
        </span>
      </div>

      {/* Voice Recorder Strip */}
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Circular Record Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isRecording ? '#f43f5e' : 'var(--bg-card-subtle)',
              border: isRecording ? 'none' : '1px solid var(--border-strong)',
              color: isRecording ? '#fff' : '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            title={isRecording ? 'Stop & Transcribe' : 'Record Statement'}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Waveform Bar */}
          <div style={{ flex: 1 }}>
            <canvas ref={canvasRef} width={340} height={32} style={{ width: '100%', height: '32px', borderRadius: '4px' }} />
            {isRecording && (
              <span style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 600 }}>
                ● Recording: {recordingTime}s (Click to stop)
              </span>
            )}
          </div>

          {/* Playback Button */}
          <button
            onClick={handlePlayVoice}
            className="btn-outline-action"
            style={{ fontSize: '11px', padding: '6px 10px', flexShrink: 0 }}
          >
            {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlayingAudio ? 'Playing…' : 'Play (Bulbul)'}</span>
          </button>
        </div>

        {errorMsg && (
          <div style={{ fontSize: '11px', color: '#fb7185', background: 'var(--color-rose-bg)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(244,63,94,0.2)' }}>
            {errorMsg}
          </div>
        )}

        {/* Statement Display & Editor */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '10px 12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              {isTranscribing ? 'Transcribing via Saaras v4…' : 'Verified Transcript:'}
            </span>
            <button
              onClick={() => {
                if (isEditing && onUpdateStatement) onUpdateStatement(editText);
                setIsEditing(!isEditing);
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              {isEditing ? <Check size={12} color="#10b981" /> : <Edit2 size={12} />}
              <span>{isEditing ? 'Save' : 'Edit'}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-strong)', color: '#fff', fontSize: '12px', padding: '6px', borderRadius: '4px', outline: 'none' }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: '12px', color: '#f1f5f9', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{driverStatement}"
            </p>
          )}
        </div>

        {/* Quick Test Statement Presets */}
        <div>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Test Templates:
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {QUICK_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                onClick={() => onUpdateStatement && onUpdateStatement(tmpl.text)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
