import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChallanScanner from './components/ChallanScanner';
import VoiceRecorder from './components/VoiceRecorder';
import LegalAuditCard from './components/LegalAuditCard';
import AudioAdvisory from './components/AudioAdvisory';
import PetitionModal from './components/PetitionModal';
import DiagnosticsModal from './components/DiagnosticsModal';
import { DEMO_CHALLANS } from './data/demoData';
import { ShieldCheck, AlertCircle, Scale, FileText, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

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
    setTimeout(() => setIsScanning(false), 800);
  };

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Executive Top Navigation */}
      <Navbar
        activeDemoId={activeDemoId}
        onSelectDemo={handleSelectDemo}
        challanList={DEMO_CHALLANS}
        onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
        onOpenPetition={() => setIsPetitionOpen(true)}
      />

      {/* Metric Strip */}
      <div style={{
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 24px'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-chip chip-rose">32.4% Fatal Error Rate</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Camera Notices Defective in Indian Metros</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-chip chip-amber">CMVR Rule 167A</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Strict 15-Day Service Statutory Limitation</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-chip chip-emerald">₹0 Filing Fee</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Direct Virtual Court Self-Filing (vcourts.gov.in)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="status-chip chip-indigo">Sarvam Multimodal</span>
            <span style={{ color: 'var(--text-tertiary)' }}>Vision + Saaras + Bulbul + Translate</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Professional Console */}
      <main className="ops-grid" style={{ flex: 1 }}>
        {/* Left Column: Evidence & Driver Statement */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        {/* Right Column: Statutory Audit & Spoken Advisory */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <LegalAuditCard
            challan={activeChallan}
            onViewPetition={() => setIsPetitionOpen(true)}
          />

          <AudioAdvisory
            challan={activeChallan}
          />
        </div>
      </main>

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

      {/* Clean Corporate Legal-Tech Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-sidebar)',
        padding: '14px 24px',
        fontSize: '12px',
        color: 'var(--text-tertiary)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ color: '#fff' }}>ChallanAI</strong> — Enterprise Legal Defense Console for Indian Traffic E-Challans
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Powered by Sarvam AI Multimodal Stack</span>
            <span>Indian Motor Vehicles Act, 1988/2019</span>
            <span>CMVR Rule 167A</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
