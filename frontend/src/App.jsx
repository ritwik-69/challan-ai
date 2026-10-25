import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ChallanScanner from './components/ChallanScanner';
import VoiceRecorder from './components/VoiceRecorder';
import LegalAuditCard from './components/LegalAuditCard';
import AudioAdvisory from './components/AudioAdvisory';
import PetitionModal from './components/PetitionModal';
import { DEMO_CHALLANS } from './data/demoData';
import { Shield, Sparkles, Scale, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeDemoId, setActiveDemoId] = useState(DEMO_CHALLANS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPetitionOpen, setIsPetitionOpen] = useState(false);
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
    setTimeout(() => setIsScanning(false), 1800);
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
      {/* Navbar with 1-Click Demo Presets */}
      <Navbar
        activeDemoId={activeDemoId}
        onSelectDemo={handleSelectDemo}
        challanList={DEMO_CHALLANS}
      />

      {/* Hero Impact Stats Ticker */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ef4444'
          }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              32.4%
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Camera Challans Flawed or Delayed
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f59e0b'
          }}>
            <Scale size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              CMVR 167A
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Mandatory 15-Day Service Limit
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10b981'
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              ₹0 Legal Fee
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Direct Virtual Court Self-Filing
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              Multimodal
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Vision + Voice + Reasoning
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Multimodal Ingestion (Scanner & Voice) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        color: 'var(--text-subtle)',
        fontSize: '0.8rem'
      }}>
        <div>
          <strong style={{ color: 'var(--text-muted)' }}>ChallanAI (चालान-न्याय)</strong> • Built for the Sarvam AI Hackathon
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Powered by Sarvam Multimodal APIs</span>
          <span>Indian Motor Vehicles Act, 1988/2019</span>
          <span>Central Motor Vehicles Rules (CMVR 167A)</span>
        </div>
      </footer>
    </div>
  );
}
