import React from 'react';
import { Scale, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Navbar({ activeDemoId, onSelectDemo, challanList }) {
  return (
    <header className="navbar-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '32px',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '20px'
    }}>
      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)'
          }}>
            <Scale size={26} color="#000" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.65rem', margin: 0, fontWeight: 800 }}>
                Challan<span style={{ color: 'var(--color-primary)' }}>AI</span>
              </h1>
              <span style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                borderLeft: '1px solid var(--border-subtle)',
                paddingLeft: '10px'
              }}>
                चालान-न्याय
              </span>
              <span className="badge badge-saffron" style={{ fontSize: '0.7rem' }}>
                <ShieldCheck size={12} /> Legal Copilot
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Multimodal Traffic E-Challan & Notice Defense Grounded in Indian Motor Vehicle Rules
            </p>
          </div>
        </div>

        {/* Sarvam AI Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          padding: '8px 16px',
          borderRadius: '9999px',
          fontSize: '0.82rem',
          color: '#c4b5fd'
        }}>
          <Sparkles size={16} color="#a78bfa" />
          <span style={{ fontWeight: 600 }}>Sarvam AI Multimodal Stack:</span>
          <span style={{ color: '#fff', fontWeight: 500 }}>Vision • Saaras • 105B • Bulbul</span>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 10px #10b981'
          }} />
        </div>
      </div>

      {/* 1-Click Interactive Demo Selector Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '10px 16px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700 }}>
          <Zap size={16} />
          <span>1-CLICK DEMO CASES:</span>
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
                  background: isActive ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.3))' : 'rgba(255, 255, 255, 0.04)',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isActive ? '0 0 12px rgba(245, 158, 11, 0.25)' : 'none'
                }}
              >
                <span>{demo.title}</span>
                <span className={`badge ${demo.badgeType}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
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
