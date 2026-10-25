import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2, VolumeX, Play, Pause, RotateCcw,
  Globe, User, Loader2, Download, AlertCircle, Sparkles
} from 'lucide-react';

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
  { id: 'aditya', name: 'Aditya (Advocate Baritone)', gender: 'Male' },
  { id: 'priya', name: 'Priya (Clear Legal Voice)', gender: 'Female' },
  { id: 'kabir', name: 'Kabir (Courtroom Tone)', gender: 'Male' },
  { id: 'ritu', name: 'Ritu (Empathetic Guide)', gender: 'Female' }
];

// Helper to format seconds to mm:ss
function formatTime(sec) {
  if (!sec || isNaN(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function AudioAdvisory({ challan }) {
  // Determine default language based on challan
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

  // In-memory audio cache: key -> base64 wav
  const audioCacheRef = useRef({});
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Reset audio & update language when active challan changes
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

  // Translate text when selected language changes and doesn't match default
  useEffect(() => {
    let isCancelled = false;

    const translateAdvisory = async () => {
      // Determine source language
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
        if (!isCancelled) {
          setTranslatedText(challan.audioAdvisoryText || '');
        }
      } finally {
        if (!isCancelled) setIsTranslating(false);
      }
    };

    translateAdvisory();
    return () => { isCancelled = true; };
  }, [selectedLang, challan.audioAdvisoryText, challan.id]);

  // Setup / fetch Sarvam Bulbul v3 audio
  const getOrFetchAudio = async (textToSpeak) => {
    const cacheKey = `${challan.id}-${selectedLang}-${selectedSpeaker}-${textToSpeak.slice(0, 30)}`;
    if (audioCacheRef.current[cacheKey]) {
      return audioCacheRef.current[cacheKey];
    }

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
      if (!data.audios || data.audios.length === 0) {
        throw new Error('Sarvam Bulbul returned no audio stream');
      }

      const b64 = data.audios[0];
      audioCacheRef.current[cacheKey] = b64;
      return b64;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePlay = async () => {
    // If currently playing, pause
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio already loaded, resume
    if (audioRef.current && !audioRef.current.ended) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (e) {
        console.warn('Error resuming audio:', e);
      }
    }

    // Need to fetch & create Audio
    try {
      const textToSpeak = translatedText || challan.audioAdvisoryText;
      const b64 = await getOrFetchAudio(textToSpeak);

      const audio = new Audio(`data:audio/wav;base64,${b64}`);
      audio.playbackRate = playbackSpeed;
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setErrorMsg('Audio playback failed in browser. Please retry.');
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('TTS execution failed:', err);
      setErrorMsg(`Failed to synthesize advisory: ${err.message}`);
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
    const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
    setPlaybackSpeed(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleScrub = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleDownload = () => {
    const textToSpeak = translatedText || challan.audioAdvisoryText;
    const cacheKey = `${challan.id}-${selectedLang}-${selectedSpeaker}-${textToSpeak.slice(0, 30)}`;
    const b64 = audioCacheRef.current[cacheKey];
    if (!b64) {
      setErrorMsg('Please play the advisory first to synthesize before downloading.');
      return;
    }
    const link = document.createElement('a');
    link.href = `data:audio/wav;base64,${b64}`;
    link.download = `ChallanAI-Advisory-${challan.challanNumber}-${selectedLang}.wav`;
    link.click();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Volume2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
              Vernacular Spoken Advisory
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Powered by Sarvam Bulbul v3 (Indic Voice Synthesis) & Sarvam Translate
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
            <Sparkles size={12} /> Live Voice Engine
          </span>
        </div>
      </div>

      {/* Multilingual & Speaker Configuration Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        padding: '12px 14px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Globe size={14} style={{ color: '#f59e0b' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Language:</span>
          <select
            value={selectedLang}
            onChange={(e) => {
              handleReset();
              setSelectedLang(e.target.value);
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f8fafc',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label} ({l.native})
              </option>
            ))}
          </select>
          {isTranslating && (
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Translating…
            </span>
          )}
        </div>

        {/* Speaker Voice Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={14} style={{ color: '#a78bfa' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Voice:</span>
          <select
            value={selectedSpeaker}
            onChange={(e) => {
              handleReset();
              setSelectedSpeaker(e.target.value);
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#f8fafc',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              cursor: 'pointer'
            }}
          >
            {SPEAKERS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Audio Player Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Play Controls & Scrubber */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Main Play/Pause Button */}
          <button
            id="btn-play-advisory"
            onClick={handleTogglePlay}
            disabled={isLoading || isTranslating}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: isLoading ? 'rgba(245, 158, 11, 0.4)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              cursor: isLoading ? 'wait' : 'pointer',
              boxShadow: isPlaying ? '0 0 20px rgba(245, 158, 11, 0.6)' : '0 4px 14px rgba(245, 158, 11, 0.4)',
              flexShrink: 0,
              transition: 'transform 0.15s ease'
            }}
            title={isPlaying ? 'Pause Advisory' : 'Listen with Sarvam Bulbul v3'}
          >
            {isLoading ? (
              <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            ) : isPlaying ? (
              <Pause size={22} />
            ) : (
              <Play size={22} style={{ marginLeft: '3px' }} />
            )}
          </button>

          {/* Equalizer Waveform & Scrubber */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div
              ref={progressBarRef}
              onClick={handleScrub}
              style={{
                height: '10px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              title="Click to seek"
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                borderRadius: '9999px',
                transition: 'width 0.1s linear'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isPlaying && (
                  <span style={{ color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                    Speaking (22 kHz)
                  </span>
                )}
                <span>Bulbul v3 · {selectedSpeaker}</span>
              </span>
            </div>
          </div>

          {/* Controls: Reset, Speed, Download */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              id="btn-advisory-reset"
              onClick={handleReset}
              className="btn-secondary"
              title="Rewind to start"
              style={{ padding: '8px 10px', fontSize: '0.75rem' }}
            >
              <RotateCcw size={14} />
            </button>

            <button
              id="btn-advisory-speed"
              onClick={handleToggleSpeed}
              className="btn-secondary"
              title="Change playback speed"
              style={{ padding: '8px 10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', minWidth: '42px' }}
            >
              {playbackSpeed}x
            </button>

            <button
              id="btn-advisory-download"
              onClick={handleDownload}
              className="btn-secondary"
              title="Download Advisory Audio (WAV)"
              style={{ padding: '8px 10px', fontSize: '0.75rem' }}
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.8rem',
            color: '#f87171'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Spoken Transcript Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px 16px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Spoken Legal Verdict Subtitles ({SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang)?.label}):
            </div>
            {isTranslating && (
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Updating script…</span>
            )}
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: '#f8fafc',
            fontFamily: 'var(--font-body)'
          }}>
            "{translatedText || challan.audioAdvisoryText}"
          </p>
        </div>
      </div>
    </div>
  );
}
