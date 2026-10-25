import React from 'react';
import { Gavel, ShieldCheck, AlertCircle, CheckCircle2, FileCheck2, ArrowUpRight, Scale } from 'lucide-react';

export default function LegalAuditCard({ challan, onViewPetition }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (challan.winProbability / 100) * circumference;

  return (
    <div className="legal-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            background: 'var(--color-emerald-bg)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Gavel size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
              AI Statutory Defense Audit & Scorecard
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Deterministic Motor Vehicles Act 1988/2019 & Central Motor Vehicles Rules Evaluation
            </span>
          </div>
        </div>

        <button
          onClick={onViewPetition}
          className="btn-primary-action"
          style={{ fontSize: '12px', padding: '7px 14px' }}
        >
          <FileCheck2 size={14} />
          <span>Draft Magistrate Petition</span>
        </button>
      </div>

      {/* Executive Scorecard Strip */}
      <div style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '20px'
      }}>
        {/* Win Rate Meter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="45" cy="45" r={radius} stroke="var(--border-subtle)" strokeWidth="7" fill="transparent" />
              <circle
                cx="45" cy="45" r={radius}
                stroke="#10b981" strokeWidth="7" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
                {challan.winProbability}%
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>
                Dismissal
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="status-chip chip-emerald" style={{ fontSize: '11px' }}>
                <ShieldCheck size={12} /> High Viability Defense
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Case Merit: Exoneration Likely
              </span>
            </div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 2px', color: '#fff' }}>
              {challan.primaryGround}
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>
              Notice procedurally time-barred as upheld by Delhi High Court & Apex Statutory Guidelines.
            </p>
          </div>
        </div>

        {/* Financial Relief Box */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          padding: '10px 16px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Direct Fine Revocation
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#f59e0b' }}>
            ₹{challan.fineAmount}
          </div>
          <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>
            ₹0 Legal Fee • Free Self-Filing
          </div>
        </div>
      </div>

      {/* Statutory Violations Table */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Identified Statutory Non-Compliances & Procedural Defects:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {challan.statutoryViolations.map((v, i) => (
            <div key={i} style={{
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                marginTop: '2px',
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: 'var(--color-rose-bg)',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertCircle size={14} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>
                    {v.summary}
                  </span>
                  <span className="status-chip chip-rose" style={{ fontSize: '10px' }}>
                    {v.status}
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#f59e0b', fontFamily: 'var(--font-mono)', marginBottom: '4px' }}>
                  Statute: {v.rule}
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {v.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discrepancy Matrix */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
          Evidentiary Audit & Compliance Matrix:
        </div>

        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '6px', overflow: 'hidden' }}>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Inspection Ground</th>
                <th>Authority Record</th>
                <th>Statutory Requirement</th>
                <th>Defect Finding</th>
              </tr>
            </thead>
            <tbody>
              {challan.discrepancyMatrix.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{row.field}</td>
                  <td style={{ color: '#fb7185' }}>{row.challanRecord}</td>
                  <td style={{ color: '#34d399' }}>{row.legalRequirement}</td>
                  <td>
                    <span className="status-chip chip-amber" style={{ fontSize: '10px' }}>
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
