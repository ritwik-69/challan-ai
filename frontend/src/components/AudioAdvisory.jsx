import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw, Globe, User, Loader2, Download, AlertCircle } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

const SUPPORTED_LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi', native: 'हिंदी' },
  { code: 'en-IN', label: 'English', native: 'English' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { code: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' }
];

const SPEAKERS = [
  { id: 'aditya', name: 'Aditya (Advocate Baritone)' },
  { id: 'priya', name: 'Priya (Clear Legal Voice)' },
  { id: 'kabir', name: 'Kabir (Courtroom Tone)' },
  { id: 'ritu', name: 'Ritu (Empathetic Guide)' }
];

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function AudioAdvisory({ challan }) {
  const getDefaultLang = () => {
    if (challan.id?.includes('mum')) return 'mr-IN';
    if (challan.id?.includes('blr')) return 'kn-IN';
    return 'hi-IN';
  };

  const [selectedLang, setSelectedLang] = useState(getDefaultLang);
  const [selectedSpeaker, setSelectedSpeaker] = useState('aditya');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [translatedText, setTranslatedText] = useState(challan.audioAdvisoryText || '');
  const [isTranslating, setIsTranslating] = useState(false);

  const audioCacheRef = useRef({});
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setErrorMsg('');
    const newLang = challan.id?.includes('mum') ? 'mr-IN' : challan.id?.includes('blr') ? 'kn-IN' : 'hi-IN';
    setSelectedLang(newLang);
    setTranslatedText(challan.audioAdvisoryText || '');
  }, [challan.id, challan.audioAdvisoryText]);

  useEffect(() => {
    let isCancelled = false;
    const translateAdvisory = async () => {
      const sourceLang = challan.id?.includes('mum') ? 'mr-IN' : 'hi-IN';
      if (selectedLang === sourceLang) {
        setTranslatedText(challan.audioAdvisoryText || '');
        return;
      }

      setIsTranslating(true);
      setErrorMsg('');
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/sarvam/translate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: challan.audioAdvisoryText,
            source_language_code: sourceLang,
            target_language_code: selectedLang
          })
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!isCancelled && data.translated_text) {
          setTranslatedText(data.translated_text);
        }
      } catch (err) {
        console.warn('Translation fallback to original:', err);
        if (!isCancelled) setTranslatedText(challan.audioAdvisoryText || '');
      } finally {
        if (!isCancelled) setIsTranslating(false);
      }
    };

    translateAdvisory();
    return () => { isCancelled = true; };
  }, [selectedLang, challan.audioAdvisoryText, challan.id]);

  const getOrFetchAudio = async (textToSpeak) => {
    const cacheKey = `${challan.id}-${selectedLang}-${selectedSpeaker}-${textToSpeak.slice(0, 30)}`;
    if (audioCacheRef.current[cacheKey]) return audioCacheRef.current[cacheKey];

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/sarvam/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          target_language_code: selectedLang,
          speaker: selectedSpeaker
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (!data.audios || data.audios.length === 0) throw new Error('No audio returned by Bulbul v3');

      const b64 = data.audios[0];
      audioCacheRef.current[cacheKey] = b64;
      return b64;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current && !audioRef.current.ended) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (e) {
        console.warn('Error resuming audio:', e);
      }
    }

    try {
      const textToSpeak = translatedText || challan.audioAdvisoryText;
      const b64 = await getOrFetchAudio(textToSpeak);

      const audio = new Audio(`data:audio/wav;base64,${b64}`);
      audio.playbackRate = playbackSpeed;
      audioRef.current = audio;

      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onloadedmetadata = () => setDuration(audio.duration);
      audio.onended = () => { setIsPlaying(false); setCurrentTime(0); };
      audio.onerror = () => { setErrorMsg('Playback error.'); setIsPlaying(false); };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      setErrorMsg(`TTS synthesis error: ${err.message}`);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleToggleSpeed = () => {
    const next = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  const handleScrub = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    setCurrentTime(newTime);
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleDownload = () => {
    const textToSpeak = translatedText || challan.audioAdvisoryText;
    const cacheKey = `${challan.id}-${selectedLang}-${selectedSpeaker}-${textToSpeak.slice(0, 30)}`;
    const b64 = audioCacheRef.current[cacheKey];
    if (!b64) {
      setErrorMsg('Play advisory first to synthesize before downloading.');
      return;
    }
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${b64}`;
    link.download = `ChallanAI_Brief_${challan.challanNumber}_${selectedLang}.wav`;
    link.click();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="legal-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--color-primary-bg)',
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Volume2 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
              Vernacular Spoken Advisory
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Sarvam Bulbul v3 (22 kHz Indic TTS) & Sarvam Translate
            </span>
          </div>
        </div>

        <span className="status-chip chip-amber" style={{ fontSize: '11px' }}>
          Real-Time Voice Brief
        </span>
      </div>

      {/* Control Strip */}
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Language & Voice Selector Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={13} style={{ color: '#f59e0b' }} />
            <span style={{ color: 'var(--text-tertiary)' }}>Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => { handleReset(); setSelectedLang(e.target.value); }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                color: '#fff',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label} ({l.native})</option>
              ))}
            </select>
            {isTranslating && <span style={{ fontSize: '11px', color: '#f59e0b' }}>Translating…</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={13} style={{ color: '#818cf8' }} />
            <span style={{ color: 'var(--text-tertiary)' }}>Voice Persona:</span>
            <select
              value={selectedSpeaker}
              onChange={(e) => { handleReset(); setSelectedSpeaker(e.target.value); }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-strong)',
                color: '#fff',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {SPEAKERS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Audio Player Scrubber Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={handleTogglePlay}
            disabled={isLoading || isTranslating}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#f59e0b',
              border: 'none',
              color: '#080a0f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title={isPlaying ? 'Pause' : 'Play Legal Advisory'}
          >
            {isLoading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
          </button>

          {/* Progress Bar */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div
              ref={progressBarRef}
              onClick={handleScrub}
              style={{
                height: '6px',
                background: 'var(--bg-card)',
                borderRadius: '9999px',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progressPercent}%`,
                background: '#f59e0b',
                borderRadius: '9999px',
                transition: 'width 0.1s linear'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <span>{isPlaying ? '● Speaking (22 kHz High Fidelity)' : 'Sarvam Bulbul v3'}</span>
            </div>
          </div>

          {/* Controls: Reset, Speed, Download */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={handleReset} className="btn-outline-action" style={{ padding: '6px 8px', fontSize: '11px' }} title="Reset">
              <RotateCcw size={13} />
            </button>
            <button onClick={handleToggleSpeed} className="btn-outline-action" style={{ padding: '6px 8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }} title="Playback Speed">
              {playbackSpeed}x
            </button>
            <button onClick={handleDownload} className="btn-outline-action" style={{ padding: '6px 8px', fontSize: '11px' }} title="Download WAV">
              <Download size={13} />
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ fontSize: '11px', color: '#fb7185', background: 'var(--color-rose-bg)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(244,63,94,0.2)' }}>
            {errorMsg}
          </div>
        )}

        {/* Subtitles Box */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '12px 14px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Spoken Legal Verdict Subtitles:
          </div>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: 1.6, color: '#f1f5f9' }}>
            "{translatedText || challan.audioAdvisoryText}"
          </p>
        </div>
      </div>
    </div>
  );
}
