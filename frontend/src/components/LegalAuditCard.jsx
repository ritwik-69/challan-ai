import React from 'react';
import { Gavel, ShieldCheck, AlertOctagon, CheckCircle2, ChevronRight, FileCheck2 } from 'lucide-react';

export default function LegalAuditCard({ challan, onViewPetition }) {
  // SVG circular gauge math
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (challan.winProbability / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <Gavel size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
              AI Legal Defense Audit
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Powered by Sarvam-105B (Indian Statutory & Case-Law Reasoning Engine)
            </span>
          </div>
        </div>

        <button
          id="btn-open-petition"
          onClick={onViewPetition}
          className="btn-primary"
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
        >
          <FileCheck2 size={16} />
          <span>View Formal Court Petition</span>
        </button>
      </div>

      {/* Top Banner: Win Probability Gauge & Primary Ground */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Probability Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="#10b981"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                {challan.winProbability}%
              </div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Win Rate
              </div>
            </div>
          </div>

          <div>
            <div className="badge badge-success" style={{ marginBottom: '6px' }}>
              <ShieldCheck size={12} /> High Dismissal Viability
            </div>
            <h4 style={{ fontSize: '1.1rem', margin: '0 0 4px', fontWeight: 700, color: '#fff' }}>
              Recommendation: Contest in Virtual Court
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '420px' }}>
              {challan.primaryGround}
            </p>
          </div>
        </div>

        {/* Action Callout */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Potential Saving</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
            ₹{challan.fineAmount} + 0 Demerit Points
          </div>
          <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 600 }}>
            Zero Legal Fee (Self-Represented Filing)
          </div>
        </div>
      </div>

      {/* Statutory Violations & Legal Loopholes List */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          Statutory Grounds & Procedural Defects Identified:
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {challan.statutoryViolations.map((v, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                marginTop: '2px',
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertOctagon size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                    {v.summary}
                  </div>
                  <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                    {v.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  Statute: {v.rule}
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {v.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discrepancy Comparison Table */}
      <div>
        <h4 style={{ fontSize: '0.92rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
          Evidence & Compliance Matrix:
        </h4>

        <div style={{
          overflowX: 'auto',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Inspection Parameter</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Challan / Police Claim</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Legal / Ground Reality</th>
                <th style={{ padding: '10px 14px', color: 'var(--text-muted)', fontWeight: 600 }}>Legal Verdict</th>
              </tr>
            </thead>
            <tbody>
              {challan.discrepancyMatrix.map((row, idx) => (
                <tr key={idx} style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent'
                }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#f1f5f9' }}>{row.field}</td>
                  <td style={{ padding: '10px 14px', color: '#f87171' }}>{row.challanRecord}</td>
                  <td style={{ padding: '10px 14px', color: '#34d399' }}>{row.legalRequirement}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fbbf24'
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
