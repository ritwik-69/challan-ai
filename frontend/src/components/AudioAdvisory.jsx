import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Sparkles, Globe, RotateCcw } from 'lucide-react';

export default function AudioAdvisory({ challan }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedLang, setSelectedLang] = useState('hi');

  // Simulation of audio playback progress
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2.5 * playbackSpeed;
        });
      }, 250);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    if (progress >= 100) setProgress(0);
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  const handleToggleSpeed = () => {
    setPlaybackSpeed((prev) => (prev === 1 ? 1.25 : prev === 1.25 ? 1.5 : 1));
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
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
              Powered by Sarvam Bulbul v3 (Natural Expressive Voice Synthesis across Indic Languages)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-saffron" style={{ fontSize: '0.72rem' }}>
            <Globe size={12} /> Language: {challan.driverLang}
          </span>
        </div>
      </div>

      {/* Audio Player Container */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.06) 0%, rgba(139, 92, 246, 0.06) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Controls and Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {/* Play/Pause Button */}
          <button
            id="btn-play-advisory"
            onClick={handleTogglePlay}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
              flexShrink: 0
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>

          {/* Progress Wave Bar */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{
              height: '8px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #f59e0b, #10b981)',
                borderRadius: '9999px',
                transition: 'width 0.2s linear'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>{Math.floor((progress / 100) * 38)}s</span>
              <span>00:38 (Bulbul v3 Audio Stream)</span>
            </div>
          </div>

          {/* Reset & Speed buttons */}
          <button
            id="btn-advisory-reset"
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
          >
            <RotateCcw size={14} />
          </button>

          <button
            id="btn-advisory-speed"
            onClick={handleToggleSpeed}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Spoken Transcript Card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '14px',
          position: 'relative'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase' }}>
            Spoken Verdict Audio Subtitles:
          </div>
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: '#f8fafc',
            fontFamily: 'var(--font-body)'
          }}>
            "{challan.audioAdvisoryText}"
          </p>
        </div>
      </div>
    </div>
  );
}
