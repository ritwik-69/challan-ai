import React, { useState } from 'react';
import { X, Copy, Check, Download, ExternalLink, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PetitionModal({ challan, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(challan.petitionDraft);
    setCopied(true);
    // Trigger confetti celebration!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([challan.petitionDraft], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Petition_${challan.challanNumber}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
        background: '#0c111d',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Modal Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
                Formal Virtual Court Dispute Petition
              </h3>
              <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                <Award size={12} /> Ready for Filing
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Jurisdiction: {challan.courtName} • Citation: {challan.challanNumber}
            </p>
          </div>

          <button
            id="btn-close-modal"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '34px',
              height: '34px',
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

        {/* Legal Document Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          background: '#070a12',
          color: '#e2e8f0',
          whiteSpace: 'pre-wrap',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {challan.petitionDraft}
        </div>

        {/* Modal Actions */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Generated via Sarvam-105B Legal Reasoning Engine
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="btn-copy-petition"
              onClick={handleCopy}
              className="btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Petition Text'}</span>
            </button>

            <button
              id="btn-download-petition"
              onClick={handleDownload}
              className="btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <Download size={16} />
              <span>Download Draft</span>
            </button>

            <a
              id="btn-goto-vcourt"
              href="https://vcourts.gov.in/virtualcourt/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: '0.82rem', textDecoration: 'none' }}
            >
              <ExternalLink size={16} />
              <span>Proceed to eCourts Portal</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
