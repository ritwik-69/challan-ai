import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Loader2, MessageSquare, Radio, AlertCircle, Edit3, Check, Sparkles } from 'lucide-react';
import { encodeWAV, resample } from '../utils/audioUtils';

const BACKEND_URL = 'http://localhost:8000';
const TARGET_SAMPLE_RATE = 16000;

const QUICK_PRESETS = [
  {
    label: '⏱️ 49-Day Delay (CMVR 167A)',
    text: 'Mera challan 49 din baad aaya hai. Central Motor Vehicle Rules ke niyam 167A ke tehat notice 15 dino ke andar bhejna mandatory hai. Itni deri ke baad ye challan legally voidable hai.',
    lang: 'hi-IN'
  },
  {
    label: '📷 ANPR Wrong Car (Sec 65B)',
    text: 'Sir photo me car Maruti Dzire dikh rahi hai jabki meri gadi Hyundai i20 hai. Plate pe BB12 likha hai aur mera number 8812 hai. Ye ANPR camera ka clear OCR error hai.',
    lang: 'hi-IN'
  },
  {
    label: '🚑 Yielded to Ambulance (Sec 194E)',
    text: 'Dadar circle pe signal red tha lekin mere theek peeche 108 ambulance siren baja rahi thi. Ambulance ko rasta dene ke liye maine car aage badhake zebra crossing pe side me lagai. Section 194E ke tehat emergency vehicle ko rasta dena mandatory hai.',
    lang: 'hi-IN'
  }
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
  const pcmChunksRef = useRef([]);   // Raw Float32 PCM chunks
  const timerRef = useRef(null);
  const audioElemRef = useRef(null);

  useEffect(() => {
    setEditText(driverStatement || '');
  }, [driverStatement]);

  // ─── Canvas Waveform Renderer ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const N = 40, bw = W / N - 2;

      let freqData = null;
      if (analyserRef.current && isRecording) {
        freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(freqData);
      }

      for (let i = 0; i < N; i++) {
        let amp;
        if (freqData && isRecording) {
          amp = Math.max(0.08, (freqData[Math.floor((i / N) * freqData.length)] / 255) * 0.95);
        } else if (isRecording) {
          amp = Math.sin(phase + i * 0.4) * 0.35 + Math.cos(phase * 1.5 + i * 0.2) * 0.3 + 0.3;
        } else if (isPlayingAudio) {
          amp = Math.sin(phase * 1.2 + i * 0.3) * 0.28 + 0.22;
        } else {
          amp = Math.sin(i * 0.2) * 0.07 + 0.09;
        }
        const bh = Math.max(4, Math.min(H - 6, amp * H));
        const x = i * (bw + 2), y = (H - bh) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + bh);
        if (isRecording) {
          grad.addColorStop(0, '#ef4444'); grad.addColorStop(1, '#f59e0b');
        } else if (isPlayingAudio) {
          grad.addColorStop(0, '#06b6d4'); grad.addColorStop(1, '#10b981');
        } else {
          grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#3b82f6');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, bw, bh, 3);
        ctx.fill();
      }
      phase += 0.08;
      animFrameRef.current = requestAnimationFrame(render);
    };
    render();
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [isRecording, isPlayingAudio]);

  // ─── Start Recording (ScriptProcessor → raw Float32 PCM) ─────────────────
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
        const input = e.inputBuffer.getChannelData(0);
        pcmChunksRef.current.push(new Float32Array(input));
      };

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioCtx.destination);

      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);

      onToggleRecord(true);
    } catch (err) {
      const msg = err.name === 'NotAllowedError'
        ? 'Microphone access denied. Please allow mic permissions in your browser.'
        : `Microphone error: ${err.message}`;
      setErrorMsg(msg);
    }
  };

  // ─── Stop Recording → Resample → Encode WAV → Send to Saaras v4 ──────────
  const stopRecording = async () => {
    clearInterval(timerRef.current);
    onToggleRecord(false);

    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (analyserRef.current) { analyserRef.current.disconnect(); analyserRef.current = null; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); }

    const chunks = pcmChunksRef.current;
    const nativeRate = audioCtxRef.current?.sampleRate || 44100;

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      await audioCtxRef.current.close();
    }

    if (!chunks.length) {
      setErrorMsg('No audio captured. Please speak into the mic.');
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
      if (!res.ok) {
        throw new Error(data.detail || `HTTP ${res.status}`);
      }

      const text = data.transcript?.trim();
      if (text && onUpdateStatement) {
        onUpdateStatement(text);
      } else if (!text) {
        setErrorMsg('No speech detected. Speak clearly in Hindi, Hinglish, or English.');
      }
    } catch (err) {
      console.error('[VoiceRecorder] STT error:', err);
      setErrorMsg(`Transcription failed: ${err.message}`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  // ─── Play Statement via Sarvam Bulbul v3 TTS ────────────────────────────
  const handlePlayVoice = async () => {
    if (isPlayingAudio) {
      audioElemRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }

    const cleanStatement = (driverStatement || '').trim();
    if (!cleanStatement) {
      setErrorMsg('No statement to play. Speak using the mic or select a demo preset.');
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
        body: JSON.stringify({
          text: cleanStatement,
          target_language_code: langCode,
          speaker: 'aditya'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.audios?.length > 0) {
        const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
        audioElemRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          setErrorMsg('Failed to play synthesized audio.');
        };
        await audio.play();
        return;
      } else {
        throw new Error('No audio returned by Bulbul v3');
      }
    } catch (err) {
      console.warn('[VoiceRecorder] TTS error:', err);
      setErrorMsg(`TTS playback failed: ${err.message}`);
      setIsPlayingAudio(false);
    }
  };

  const handleSaveEdit = () => {
    if (onUpdateStatement) {
      onUpdateStatement(editText);
    }
    setIsEditing(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#a78bfa'
          }}>
            <Mic size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
              Driver Voice Statement (Vernacular Ingestion)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Powered by Sarvam Saaras v4 (Multilingual STT) · Live 16 kHz PCM
            </span>
          </div>
        </div>
        <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}>
          <Radio size={12} /> {driverLang}
        </span>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.38)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Mic Button */}
          <button
            id="btn-voice-record"
            onClick={handleMicClick}
            className={isRecording ? 'recording-pulse' : ''}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: isRecording ? '#ef4444' : 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: isRecording ? '0 0 24px #ef4444' : '0 6px 18px rgba(139, 92, 246, 0.45)',
              transition: 'transform 0.15s ease'
            }}
            title={isRecording ? 'Stop & Transcribe with Saaras v4' : 'Click to Speak Statement'}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* Waveform */}
          <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <canvas ref={canvasRef} width={420} height={42}
              style={{ width: '100%', height: 42, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }} />
            {isRecording && (
              <span style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700, marginTop: 4 }}>
                ● RECORDING LIVE: {recordingTime}s — Click mic to transcribe via Saaras v4
              </span>
            )}
          </div>

          {/* Play/TTS button */}
          <button
            id="btn-listen-voice"
            onClick={handlePlayVoice}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '9px 14px', flexShrink: 0 }}
          >
            {isPlayingAudio ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlayingAudio ? 'Playing…' : 'Play (Bulbul)'}</span>
          </button>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: 8, padding: '9px 12px', fontSize: '0.8rem', color: '#f87171' }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Transcription Display */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: '#a78bfa', fontWeight: 700 }}>
              {isTranscribing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <MessageSquare size={14} />}
              <span>{isTranscribing ? 'SARVAM SAARAS v4 TRANSCRIBING…' : 'VERIFIED DRIVER STATEMENT:'}</span>
            </div>
            
            <button
              onClick={() => {
                if (isEditing) handleSaveEdit();
                else setIsEditing(true);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: isEditing ? '#34d399' : 'var(--text-muted)',
                fontSize: '0.72rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              {isEditing ? <Check size={13} /> : <Edit3 size={13} />}
              <span>{isEditing ? 'Save Text' : 'Edit Text'}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '6px',
                color: '#fff',
                padding: '8px 10px',
                fontSize: '0.86rem',
                lineHeight: 1.5,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          ) : (
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: '#f8fafc', fontStyle: 'italic' }}>
              "{driverStatement}"
            </p>
          )}
        </div>

        {/* Quick Statement Presets */}
        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
            Quick 1-Click Statement Templates (Or Speak into Mic):
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {QUICK_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onUpdateStatement) onUpdateStatement(preset.text);
                }}
                className="btn-secondary"
                style={{
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
