import React, { useState } from 'react';
import { Scan, Eye, AlertTriangle, CheckCircle, FileText, Camera, UploadCloud } from 'lucide-react';

export default function ChallanScanner({ challan, isScanning, onTriggerScan }) {
  const [activeHighlight, setActiveHighlight] = useState('all');

  return (
    <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Laser scan effect when scanning */}
      {isScanning && <div className="scan-laser" />}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(6, 182, 212, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#06b6d4'
          }}>
            <Scan size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>
              Evidence & Challan Scanner
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Powered by Sarvam Vision (Multilingual Document & Crop OCR)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            id="btn-trigger-scan"
            onClick={onTriggerScan}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <Scan size={14} />
            <span>{isScanning ? 'Scanning...' : 'Re-Run Vision OCR'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Two Columns: Document Slip & Camera Crop */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        
        {/* Left Column: Official E-Challan Notice Replica */}
        <div style={{
          background: '#090d16',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          position: 'relative',
          fontFamily: 'var(--font-mono)'
        }}>
          {/* Header watermark */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
            paddingBottom: '10px',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {challan.authority}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                GOVERNMENT OF INDIA • E-CHALLAN REPOSITORY
              </div>
            </div>
            <div className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
              NOTICE REF: {challan.challanNumber}
            </div>
          </div>

          {/* Key Attributes with Visual Bounding Box Highlighting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vehicle Reg No:</span>
              <span style={{ fontWeight: 700, color: '#fff', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                {challan.registeredVehicle.plate}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Vehicle Make/Class:</span>
              <span style={{ color: '#fff' }}>{challan.registeredVehicle.model}</span>
            </div>

            {/* Bounding Box 1: Offence Date vs Notice Date */}
            <div style={{
              background: challan.daysElapsed > 15 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255,255,255,0.03)',
              border: challan.daysElapsed > 15 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '8px',
              position: 'relative'
            }}>
              {challan.daysElapsed > 15 && (
                <div style={{
                  position: 'absolute',
                  top: '-9px',
                  right: '8px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '3px'
                }}>
                  RULE 167A DEFECT: {challan.daysElapsed} DAYS ELAPSED
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Offence Date:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{challan.offenceDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Notice Dispatch Date:</span>
                <span style={{ color: challan.daysElapsed > 15 ? '#f87171' : '#f8fafc', fontWeight: 700 }}>
                  {challan.noticeDate}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Alleged Violation:</span>
              <span style={{ color: '#f59e0b', fontWeight: 600, textAlign: 'right', maxWidth: '65%' }}>
                {challan.offenceSection}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Location:</span>
              <span style={{ color: '#cbd5e1', textAlign: 'right', maxWidth: '65%' }}>
                {challan.location}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px dashed rgba(255,255,255,0.15)',
              paddingTop: '8px',
              marginTop: '4px'
            }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>DEMANDED PENALTY:</span>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f87171' }}>
                ₹{challan.fineAmount}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: ITMS Camera Evidence Snapshot & ANPR Analysis */}
        <div style={{
          background: '#090d16',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#06b6d4' }}>
                <Camera size={16} />
                <span>ITMS Photographic Evidence</span>
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                Camera: {challan.cameraEvidence.cameraType}
              </span>
            </div>

            {/* Simulated Camera Feed Container */}
            <div style={{
              height: '140px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #131a2a 0%, #0c121e 100%)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
            }}>
              {/* CCTV gridlines and HUD overlay */}
              <div style={{
                position: 'absolute',
                top: '6px',
                left: '8px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: '#34d399',
                display: 'flex',
                gap: '12px'
              }}>
                <span>CAM_REC: ● LIVE</span>
                <span>IR_SENSOR: ACTIVE</span>
              </div>

              <div style={{
                position: 'absolute',
                bottom: '6px',
                left: '8px',
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                color: '#94a3b8'
              }}>
                GPS: 28.5823° N, 77.2619° E
              </div>

              {/* Bounding Box on Evidence */}
              <div style={{
                border: '2px solid #06b6d4',
                padding: '6px 14px',
                borderRadius: '6px',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
              }}>
                <div style={{ fontSize: '0.62rem', color: '#06b6d4', fontWeight: 700, letterSpacing: '0.05em' }}>
                  SARVAM VISION ANPR CROP
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#fff',
                  background: '#000',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  border: '1px solid #334155'
                }}>
                  {challan.cameraEvidence.anprPlateDetected}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                  Confidence: <span style={{ color: '#34d399', fontWeight: 600 }}>{challan.cameraEvidence.plateConfidence}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Analysis Findings */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Sarvam Vision OCR Findings:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {challan.cameraEvidence.visualDefects.map((defect, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.74rem',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.08)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}>
                  <AlertTriangle size={13} style={{ flexShrink: 0 }} />
                  <span>{defect}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
