import React from 'react';
import { Scale, Sparkles, ShieldCheck, Zap, Activity, FilePlus, ChevronRight } from 'lucide-react';

export default function Navbar({
  activeDemoId,
  onSelectDemo,
  challanList,
  onOpenDiagnostics,
  activeStep,
  onSelectStep
}) {
  const steps = [
    { id: 'scan', label: '1. Evidence Scan', badge: 'Vision OCR' },
    { id: 'voice', label: '2. Driver Voice', badge: 'Saaras v4' },
    { id: 'audit', label: '3. Legal Audit', badge: 'Rules Engine' },
    { id: 'advisory', label: '4. Spoken Advisory', badge: 'Bulbul v3' },
  ];

  return (
    <header className="navbar-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      marginBottom: '32px',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '24px'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '18px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
          }}>
            <Scale size={28} color="#06080d" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.85rem', margin: 0, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                Challan<span style={{ color: 'var(--color-primary)' }}>AI</span>
              </h1>
              <span style={{
                fontSize: '1.05rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '10px'
              }}>
                चालान-न्याय
              </span>
              <span className="badge badge-saffron" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
                <ShieldCheck size={12} /> Statutory Copilot
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Multimodal Traffic E-Challan Defense Gateway powered by <strong style={{ color: '#c4b5fd' }}>Sarvam AI</strong>
            </p>
          </div>
        </div>

        {/* Live Diagnostics & System Health Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onOpenDiagnostics}
            className="btn-secondary"
            style={{
              fontSize: '0.8rem',
              padding: '8px 14px',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              color: '#c4b5fd'
            }}
            title="View Live Sarvam AI API Connection Status"
          >
            <Sparkles size={14} color="#a78bfa" />
            <span style={{ fontWeight: 600 }}>Sarvam Multimodal Stack</span>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block'
            }} />
          </button>
        </div>
      </div>

      {/* Multimodal Pipeline Progress Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        padding: '6px',
        overflowX: 'auto',
        gap: '4px'
      }}>
        {steps.map((st, idx) => (
          <React.Fragment key={st.id}>
            <div
              style={{
                flex: 1,
                minWidth: '160px',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {idx + 1}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {st.label.split('. ')[1]}
                </span>
              </div>
              <span className="badge badge-ai" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                {st.badge}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <ChevronRight size={14} style={{ color: 'var(--text-subtle)', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 1-Click Interactive Demo Selector Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        background: 'rgba(255, 255, 255, 0.025)',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.84rem', fontWeight: 800 }}>
          <Zap size={16} />
          <span>PRELOADED COURT CONTEST CASES:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
          {challanList.map((demo) => {
            const isActive = demo.id === activeDemoId;
            return (
              <button
                key={demo.id}
                id={`btn-demo-${demo.id}`}
                onClick={() => onSelectDemo(demo.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(217, 119, 6, 0.32) 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isActive ? '0 0 16px rgba(245, 158, 11, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{demo.title}</span>
                <span className={`badge ${demo.badgeType}`} style={{ fontSize: '0.64rem', padding: '2px 6px' }}>
                  {demo.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
