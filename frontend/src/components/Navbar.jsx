import React from 'react';
import { Scale, Activity, FileCheck, Layers, MapPin, Sparkles, HelpCircle } from 'lucide-react';

export default function Navbar({
  activeDemoId,
  onSelectDemo,
  challanList,
  onOpenDiagnostics,
  onOpenPetition
}) {
  const activeChallan = challanList.find((c) => c.id === activeDemoId) || challanList[0];

  return (
    <header className="app-header">
      {/* Primary Top Bar */}
      <div className="header-inner">
        {/* Brand & Court Context */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#080a0f',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              <Scale size={18} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  ChallanAI
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                  चालान-न्याय
                </span>
                <span className="status-chip chip-amber" style={{ fontSize: '10px', padding: '1px 6px' }}>
                  Enterprise Legal Tech
                </span>
              </div>
            </div>
          </div>

          <div style={{
            height: '20px',
            width: '1px',
            background: 'var(--border-subtle)'
          }} />

          {/* Active Jurisdiction Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <MapPin size={13} style={{ color: '#f59e0b' }} />
            <span>Jurisdiction:</span>
            <strong style={{ color: '#f1f5f9' }}>{activeChallan.courtName}</strong>
          </div>
        </div>

        {/* Right Actions: Sarvam Status & Direct Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sarvam AI Status Button */}
          <button
            onClick={onOpenDiagnostics}
            className="btn-outline-action"
            style={{ fontSize: '12px', padding: '6px 12px' }}
            title="Inspect Live Sarvam Model Telemetry"
          >
            <span className="dot-live" />
            <span style={{ color: 'var(--text-secondary)' }}>Sarvam AI Suite:</span>
            <strong style={{ color: '#fff' }}>Online (4 APIs)</strong>
          </button>

          {/* Direct File Dispute Petition Button */}
          <button
            onClick={onOpenPetition}
            className="btn-primary-action"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <FileCheck size={14} />
            <span>Generate Court Petition</span>
          </button>
        </div>
      </div>

      {/* Secondary Bar: Clean Case Presets Switcher */}
      <div style={{
        background: 'var(--bg-panel)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '8px 24px'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Active Case Dossier:
            </span>

            <div className="segmented-control">
              {challanList.map((demo) => {
                const isActive = demo.id === activeDemoId;
                return (
                  <button
                    key={demo.id}
                    id={`btn-demo-${demo.id}`}
                    onClick={() => onSelectDemo(demo.id)}
                    className={`segmented-btn ${isActive ? 'active' : ''}`}
                  >
                    <span>{demo.title}</span>
                    <span className={`status-chip ${demo.id.includes('delhi') ? 'chip-rose' : demo.id.includes('blr') ? 'chip-indigo' : 'chip-emerald'}`} style={{ fontSize: '10px', padding: '1px 5px' }}>
                      {demo.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-tertiary)' }}>
            <span>Statutory Ground: <strong style={{ color: '#f1f5f9' }}>{activeChallan.primaryGround.split(' — ')[0]}</strong></span>
            <span>Notice: <strong style={{ color: '#f1f5f9', fontFamily: 'var(--font-mono)' }}>{activeChallan.challanNumber}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
}
