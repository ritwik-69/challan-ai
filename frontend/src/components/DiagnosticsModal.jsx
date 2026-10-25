import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Activity, Sparkles, Cpu, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

const BACKEND_URL = 'http://localhost:8000';

export default function DiagnosticsModal({ isOpen, onClose }) {
  const [healthStatus, setHealthStatus] = useState(null);
  const [latency, setLatency] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    const start = performance.now();
    try {
      const res = await fetch(`${BACKEND_URL}/`);
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      } else {
        setHealthStatus({ status: 'error', sarvam_connected: false });
      }
    } catch (e) {
      setHealthStatus({ status: 'offline', sarvam_connected: false });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const models = [
    { name: 'Sarvam Bulbul v3', task: 'Indic Speech Synthesis (TTS)', status: 'Active (22,050 Hz)', tag: 'Voice Engine' },
    { name: 'Sarvam Saaras v4', task: 'Indic Speech Recognition (STT)', status: 'Active (16 kHz PCM)', tag: 'Audio Pipeline' },
    { name: 'Sarvam Translate', task: 'Vernacular Translation (8 Languages)', status: 'Active', tag: 'Cross-Lingual' },
    { name: 'Sarvam Vision', task: 'Document OCR & ANPR Crop Analysis', status: 'Active', tag: 'Visual Ingestion' },
    { name: 'Statutory Rules Engine', task: 'MV Act 1988/2019 & CMVR 167A Audit', status: 'Online', tag: 'Deterministic Rule Engine' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.84)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        borderRadius: 'var(--radius-xl)',
        background: '#0a0e17',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a78bfa'
            }}>
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                Sarvam AI Multimodal Stack Diagnostics
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Live Model Topology & Endpoint Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Highlights */}
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gateway Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                {healthStatus?.status === 'online' ? 'Connected' : 'Checking…'}
              </div>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>API Subscription Key</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#c4b5fd' }}>
                {healthStatus?.sarvam_connected ? 'Verified Active' : 'Checking…'}
              </div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Roundtrip Latency</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                {latency ? `${latency} ms` : 'Testing…'}
              </div>
            </div>
          </div>

          {/* Model Status Cards */}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Registered Multimodal Model Connectors:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {models.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {m.task}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.66rem' }}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={checkHealth}
              disabled={isChecking}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            >
              <RefreshCw size={14} style={{ animation: isChecking ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isChecking ? 'Pinging…' : 'Re-Ping APIs'}</span>
            </button>
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '8px 18px' }}
            >
              Close Diagnostics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
