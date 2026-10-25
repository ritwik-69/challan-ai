import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChallanScanner from './components/ChallanScanner';
import VoiceRecorder from './components/VoiceRecorder';
import LegalAuditCard from './components/LegalAuditCard';
import AudioAdvisory from './components/AudioAdvisory';
import PetitionModal from './components/PetitionModal';
import DiagnosticsModal from './components/DiagnosticsModal';
import { DEMO_CHALLANS } from './data/demoData';
import { Shield, Sparkles, Scale, AlertCircle, FileText, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export default function App() {
  const [activeDemoId, setActiveDemoId] = useState(DEMO_CHALLANS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPetitionOpen, setIsPetitionOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [customStatements, setCustomStatements] = useState({});

  const baseChallan = DEMO_CHALLANS.find((c) => c.id === activeDemoId) || DEMO_CHALLANS[0];
  const activeChallan = {
    ...baseChallan,
    driverStatement: customStatements[activeDemoId] || baseChallan.driverStatement
  };

  const handleSelectDemo = (id) => {
    setActiveDemoId(id);
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1600);
  };

  const handleToggleRecord = (recordingState) => {
    setIsRecording(typeof recordingState === 'boolean' ? recordingState : !isRecording);
  };

  const handleUpdateStatement = (newStatement) => {
    setCustomStatements((prev) => ({
      ...prev,
      [activeDemoId]: newStatement
    }));
  };

  return (
    <div className="app-container">
      {/* Navbar with 1-Click Demo Presets & Pipeline Tracker */}
      <Navbar
        activeDemoId={activeDemoId}
        onSelectDemo={handleSelectDemo}
        challanList={DEMO_CHALLANS}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
      />

      {/* Hero Impact Stats Ticker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              32.4%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Camera Challans Flawed / Delayed
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Scale size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              CMVR 167A
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Mandatory 15-Day Service Rule
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              ₹0 Legal Fee
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Direct Virtual Court Self-Filing
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              Multimodal
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Vision + Voice + Translation
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Left Column: Multimodal Ingestion (Scanner & Voice) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <ChallanScanner
            challan={activeChallan}
            isScanning={isScanning}
            onTriggerScan={handleTriggerScan}
          />

          <VoiceRecorder
            driverStatement={activeChallan.driverStatement}
            driverLang={activeChallan.driverLang}
            isRecording={isRecording}
            onToggleRecord={handleToggleRecord}
            onUpdateStatement={handleUpdateStatement}
          />
        </div>

        {/* Right Column: AI Legal Audit & Spoken Advisory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <LegalAuditCard
            challan={activeChallan}
            onViewPetition={() => setIsPetitionOpen(true)}
          />

          <AudioAdvisory
            challan={activeChallan}
          />
        </div>
      </div>

      {/* Formal Virtual Court Petition Modal */}
      <PetitionModal
        challan={activeChallan}
        isOpen={isPetitionOpen}
        onClose={() => setIsPetitionOpen(false)}
      />

      {/* Sarvam AI Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
      />

      {/* Footer */}
      <footer style={{
        marginTop: '70px',
        paddingTop: '28px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '18px',
        color: 'var(--text-subtle)',
        fontSize: '0.82rem'
      }}>
        <div>
          <strong style={{ color: 'var(--text-muted)' }}>ChallanAI (चालान-न्याय)</strong> • Built for the Sarvam AI Hackathon
        </div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <span>Sarvam Vision • Saaras v4 • Bulbul v3 • Translate</span>
          <span>Indian Motor Vehicles Act 1988/2019</span>
          <span>Central Motor Vehicles Rules (CMVR 167A)</span>
        </div>
      </footer>
    </div>
  );
}
