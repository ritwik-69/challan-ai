import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Loader2, MessageSquare, Radio, AlertCircle } from 'lucide-react';
import { encodeWAV, resample } from '../utils/audioUtils';

const BACKEND_URL = 'http://localhost:8000';
const TARGET_SAMPLE_RATE = 16000;

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

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const processorRef = useRef(null);
  const pcmChunksRef = useRef([]);   // Raw Float32 PCM chunks
  const timerRef = useRef(null);
  const audioElemRef = useRef(null);

  // ─── Canvas Waveform Renderer ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;
      const N = 38, bw = W / N - 2;

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

      // Use the native browser sample rate, we'll resample to 16kHz later
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);

      // AnalyserNode for waveform visualisation
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;

      // ScriptProcessor to capture raw PCM frames
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
        ? 'Microphone access denied. Please allow mic permission in your browser.'
        : `Microphone error: ${err.message}`;
      setErrorMsg(msg);
    }
  };

  // ─── Stop Recording → Resample → Encode WAV → Send to Saaras v4 ──────────
  const stopRecording = async () => {
    clearInterval(timerRef.current);
    onToggleRecord(false);

    // Tear down audio graph
    if (processorRef.current) { processorRef.current.disconnect(); processorRef.current = null; }
    if (analyserRef.current) { analyserRef.current.disconnect(); analyserRef.current = null; }
    if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach((t) => t.stop()); }

    const chunks = pcmChunksRef.current;
    const nativeRate = audioCtxRef.current?.sampleRate || 44100;

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      await audioCtxRef.current.close();
    }

    if (!chunks.length) {
      setErrorMsg('No audio captured. Please try again.');
      return;
    }

    // Merge all chunks into one Float32Array
    const total = chunks.reduce((s, c) => s + c.length, 0);
    const merged = new Float32Array(total);
    let off = 0;
    for (const c of chunks) { merged.set(c, off); off += c.length; }

    // Resample from browser native rate → 16000 Hz
    const resampled = resample(merged, nativeRate, TARGET_SAMPLE_RATE);

    // Encode to WAV Blob
    const wavBlob = encodeWAV(resampled, TARGET_SAMPLE_RATE);
    console.log(`[VoiceRecorder] WAV ready: ${wavBlob.size} bytes, native=${nativeRate}Hz, resampled=${TARGET_SAMPLE_RATE}Hz`);

    // Send to backend → Sarvam Saaras v4
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
        setErrorMsg('No speech detected. Speak clearly and try again.');
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

  // ─── Play Advisory via Sarvam Bulbul v3 TTS ──────────────────────────────
  const handlePlayVoice = async () => {
    if (isPlayingAudio) {
      audioElemRef.current?.pause();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/sarvam/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: driverStatement, target_language_code: 'hi-IN', speaker: 'aditya' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.audios?.length > 0) {
          const audio = new Audio(`data:audio/wav;base64,${data.audios[0]}`);
          audioElemRef.current = audio;
          audio.onended = () => setIsPlayingAudio(false);
          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('[VoiceRecorder] TTS error:', err);
    }
    setTimeout(() => setIsPlayingAudio(false), 4000);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
            <Mic size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Driver Voice Statement (Live Mic)</h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Sarvam Saaras v4 (STT) · Sarvam Bulbul v3 (TTS)
            </span>
          </div>
        </div>
        <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}>
          <Radio size={12} /> {driverLang}
        </span>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Controls Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Mic Button */}
          <button
            id="btn-voice-record"
            onClick={handleMicClick}
            className={isRecording ? 'recording-pulse' : ''}
            style={{
              width: 54, height: 54, borderRadius: '50%',
              background: isRecording ? '#ef4444' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', flexShrink: 0,
              boxShadow: isRecording ? '0 0 20px #ef4444' : '0 4px 14px rgba(139,92,246,0.4)'
            }}
            title={isRecording ? 'Stop & Transcribe' : 'Click to speak (Hindi / Hinglish / English)'}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* Waveform */}
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <canvas ref={canvasRef} width={420} height={40}
              style={{ width: '100%', height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.02)' }} />
            {isRecording && (
              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700, marginTop: 2 }}>
                ● LIVE REC: {recordingTime}s — Click mic to stop & transcribe
              </span>
            )}
          </div>

          {/* Play/TTS button */}
          <button id="btn-listen-voice" onClick={handlePlayVoice} className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px', flexShrink: 0 }}>
            {isPlayingAudio ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlayingAudio ? 'Playing…' : 'Play (Bulbul)'}</span>
          </button>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem', color: '#f87171' }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Transcription Display */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#a78bfa', fontWeight: 700 }}>
              {isTranscribing ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <MessageSquare size={14} />}
              <span>{isTranscribing ? 'SAARAS v4 TRANSCRIBING…' : 'SARVAM SAARAS TRANSCRIPT:'}</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>16 kHz Mono WAV · Live STT</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.5, color: '#f8fafc', fontStyle: 'italic' }}>
            "{driverStatement}"
          </p>
        </div>
      </div>
    </div>
  );
}
