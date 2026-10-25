# ChallanAI (ChallanNyay | चालान-न्याय) ⚖️
### Autonomous Multimodal Traffic E-Challan & Notice Defense Copilot

[![Built for Sarvam AI Hackathon](https://img.shields.io/badge/Hackathon-Sarvam%20AI-orange.svg)](https://sarvam.ai)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20+%20Vite-61DAFB.svg)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![Sarvam Multimodal](https://img.shields.io/badge/AI%20Stack-Vision%20%7C%20Saaras%20%7C%20105B%20%7C%20Bulbul-purple.svg)](https://docs.sarvam.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚦 Overview

Across Indian cities, Automated Number Plate Recognition (ANPR) and Intelligent Traffic Management Systems (ITMS) issue tens of millions of automated camera challans annually. 

However, **over 30% of these automated challans are legally flawed or procedurally defective**:
1. **The 15-Day Rule Violation (CMVR Rule 167A):** Electronic notices are routinely served 30 to 90 days after the offence, directly violating the mandatory statutory 15-day service window.
2. **Emergency Vehicle Duty Penalties (Section 194E):** Motorists who cross stop-lines to let screaming ambulances pass are blindly fined by junction cameras.
3. **ANPR Character Confusion (Evidence Act Sec 65B):** Camera OCR algorithms confuse numbers on non-standard plates (e.g., `8` read as `B`, `0` read as `D`) or penalize the wrong vehicle make entirely.

Because hiring a lawyer costs ₹2,000+ for a ₹500–₹1,000 fine, 95% of citizens surrender and pay.

**ChallanAI** changes the game: It allows motorists to upload their challan slip, speak their context in their mother tongue, and within seconds receive:
* **Statutory violation breakdown** and a **Win Probability score**
* A formatted, cited **Virtual Court petition** ready to file on `ecourts.gov.in`
* A **spoken voice advisory** in their regional language explaining their legal defense

---

## 🧠 Multimodal Sarvam AI Architecture

ChallanAI harnesses the full sovereign Indian AI stack provided by **Sarvam AI**:

| Sarvam Model | Role in ChallanAI | Real-World Function |
| :--- | :--- | :--- |
| 👁️ **Sarvam Vision** | Document & Photographic OCR | Extracts dates, fine sections, plate numbers, and performs character-level diffs on camera crops. |
| 🎙️ **Sarvam Saaras v4** | Multilingual Speech-to-Text | Transcribes driver voice notes with real-time dialect and code-mixed Hinglish handling. |
| ⚖️ **Sarvam-105B** | Indic Legal Reasoning Engine | Evaluates Central Motor Vehicle Rules (CMVR), calculates Win Probability, and drafts formal court petitions. |
| 🔊 **Sarvam Bulbul v3** | Expressive Voice Synthesis | Speaks natural, dialect-aware audio advisories in Indian languages with bilingual subtitles. |

---

## ⚡ 1-Click Interactive Demo Presets

The frontend includes three realistic preloaded scenarios:
1. 🚨 **Delhi (Speeding Notice):** Notice served 49 days after offence (*CMVR Rule 167A Violation — 94% Win Rate*).
2. 📷 **Bengaluru (Red Light Camera):** ANPR camera OCR confused `8812` with `BB12` on a different car model (*98% Win Rate*).
3. 🚑 **Mumbai (Dadar Junction):** Motorist crossed stop-line to give way to an active 108 Emergency Ambulance (*Section 194E Exemption — 91% Win Rate*).

---

## 🛠️ Tech Stack & Directory Structure

```
challan-ai/
├── README.md                        # Project documentation
├── ARCHITECTURE.md                  # Comprehensive system architecture & data contracts
├── EXPLANATION.md                   # Plain-English project walkthrough & pitch guide
├── PROJECT_BLUEPRINT.md             # Product specification & problem statement
├── Idea Library.pdf                 # Hackathon reference catalog
│
├── frontend/                        # React + Vite Application
│   ├── src/
│   │   ├── components/              # Scanner, VoiceRecorder, LegalAuditCard, AudioAdvisory, PetitionModal
│   │   ├── data/                    # Realistic test cases (Delhi, Bengaluru, Mumbai)
│   │   ├── utils/                   # Client-side 16-bit PCM WAV audio encoder
│   │   ├── App.jsx                  # Main application orchestrator
│   │   └── index.css                # Glassmorphic dark-mode design system
│   └── package.json
│
└── backend/                         # FastAPI Gateway
    ├── main.py                      # REST endpoints (/api/v1/sarvam/tts, /stt, /evaluate)
    ├── services/
    │   ├── sarvam_service.py        # Live Sarvam Bulbul v3 & Saaras v4 connectors
    │   └── legal_engine.py          # Python statutory rules engine (167A, 194E, ANPR)
    ├── requirements.txt
    └── .env.example
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Node.js** v18+ and **npm**
* **Python** 3.10+
* A **Sarvam AI API Key** from [dashboard.sarvam.ai](https://dashboard.sarvam.ai)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Create .env and insert your API key:
echo SARVAM_API_KEY=your_sarvam_api_key_here > .env

# Run FastAPI backend:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API docs available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open your browser at: **`http://localhost:5173/`**

---

## 📜 Legal Disclaimer
ChallanAI generates automated representations based on statutory Indian motor vehicle rules. It does not provide formal legal counsel or represent clients in court under the Advocates Act, 1961. Representations are designed for self-filing by vehicle owners on official state Virtual Court portals.

---

## 👥 Authors
Built with pride for the **Sarvam AI Hackathon**.
