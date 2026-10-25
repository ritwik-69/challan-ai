import React, { useState } from 'react';
import { FileText, Camera, AlertTriangle, CheckCircle, Scan, ShieldCheck, Eye, Layers } from 'lucide-react';

export default function ChallanScanner({ challan, isScanning, onTriggerScan }) {
  const [activeTab, setActiveTab] = useState('notice'); // 'notice' | 'camera'

  return (
    <div className="legal-card" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--color-sky-bg)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Scan size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
              Evidence & Intake Dossier
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
              Sarvam Vision OCR • Document & Photographic Analysis
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Segmented View Switcher */}
          <div className="segmented-control">
            <button
              onClick={() => setActiveTab('notice')}
              className={`segmented-btn ${activeTab === 'notice' ? 'active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              <FileText size={12} />
              <span>Notice Slip</span>
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`segmented-btn ${activeTab === 'camera' ? 'active' : ''}`}
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              <Camera size={12} />
              <span>Camera Feed</span>
            </button>
          </div>

          <button
            onClick={onTriggerScan}
            className="btn-outline-action"
            style={{ fontSize: '11px', padding: '5px 10px' }}
            title="Re-run optical character extraction"
          >
            <span>{isScanning ? 'Extracting…' : 'Re-Scan'}</span>
          </button>
        </div>
      </div>

      {/* Main Evidence Viewer */}
      {activeTab === 'notice' ? (
        /* Government Notice Slip Replica */
        <div style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}>
          {/* Document Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            marginBottom: '14px'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9' }}>
                {challan.authority}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Government of India • Ministry of Road Transport & Highways
              </div>
            </div>
            <span className="status-chip chip-amber" style={{ fontSize: '11px' }}>
              Ref: {challan.challanNumber}
            </span>
          </div>

          {/* Key Value Inspection Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                Registered Plate / Class
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {challan.registeredVehicle.plate}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                {challan.registeredVehicle.model}
              </div>
            </div>

            <div style={{ padding: '8px 10px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '2px' }}>
                Demanded Penalty
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#f43f5e' }}>
                ₹{challan.fineAmount}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                Status: Pending Contest
              </div>
            </div>
          </div>

          {/* Statutory Timing Audit Banner */}
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: challan.daysElapsed > 15 ? 'var(--color-rose-bg)' : 'var(--bg-card)',
            border: challan.daysElapsed > 15 ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)',
            borderRadius: '6px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Statutory Notice Service Timeline:
              </span>
              {challan.daysElapsed > 15 && (
                <span className="status-chip chip-rose" style={{ fontSize: '10px' }}>
                  Rule 167A Violation (49 Days)
                </span>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>Offence: <strong style={{ color: '#fff' }}>{challan.offenceDate.split(', ')[0]}</strong></span>
              <span>Dispatched: <strong style={{ color: challan.daysElapsed > 15 ? '#fb7185' : '#fff' }}>{challan.noticeDate.split(', ')[0]}</strong></span>
              <span>Delay: <strong style={{ color: challan.daysElapsed > 15 ? '#fb7185' : '#fff' }}>{challan.daysElapsed} Days (Max 15)</strong></span>
            </div>
          </div>

          {/* Location & Offence */}
          <div style={{ marginTop: '12px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Offence Section:</span>
              <span style={{ color: '#f59e0b', fontWeight: 600, textAlign: 'right' }}>{challan.offenceSection}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Location:</span>
              <span style={{ color: '#cbd5e1', textAlign: 'right' }}>{challan.location}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Camera Feed Evidence Crop */
        <div style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Sensor: <strong>{challan.cameraEvidence.cameraType}</strong></span>
            <span className="status-chip chip-sky">ANPR Crop #410</span>
          </div>

          {/* Camera Frame Preview */}
          <div style={{
            height: '130px',
            background: '#04060a',
            border: '1px solid var(--border-strong)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '6px',
              left: '8px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              color: '#10b981'
            }}>
              ● ITMS LIVE CAPTURE • 1920x1080 60FPS
            </div>

            <div style={{
              border: '2px solid #0ea5e9',
              padding: '6px 14px',
              borderRadius: '6px',
              background: 'rgba(14, 165, 233, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
                Detected Plate Characters
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>
                {challan.cameraEvidence.anprPlateDetected}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>
                OCR Confidence: <strong style={{ color: '#34d399' }}>{challan.cameraEvidence.plateConfidence}</strong>
              </div>
            </div>
          </div>

          {/* Optical Defects Detected */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Forensic Visual Findings:
            </div>
            {challan.cameraEvidence.visualDefects.map((defect, i) => (
              <div key={i} style={{
                fontSize: '12px',
                color: '#fbbf24',
                background: 'var(--color-primary-bg)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '6px 10px',
                borderRadius: '4px',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                <span>{defect}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
