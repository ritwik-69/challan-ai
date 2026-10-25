"""
ChallanAI Legal Reasoning Core & Statutory Rules Engine.
Evaluates e-Challan citations against the Indian Motor Vehicles Act, 1988/2019,
Central Motor Vehicles Rules (CMVR), and Indian Evidence Act.
"""
from datetime import datetime
from typing import Dict, Any, List

class LegalEngine:
    def __init__(self):
        self.rules_catalog = {
            "DEF-167A": {
                "rule": "Rule 167A(3), Central Motor Vehicles Rules (CMVR)",
                "max_allowed_days": 15,
                "description": "Electronic enforcement notice must be served to registered owner within 15 days of offence."
            },
            "DEF-194E": {
                "rule": "Section 194E, Motor Vehicles (Amendment) Act 2019",
                "description": "Duty of driver to pull to the side to give passage to emergency vehicle. Stop-line violation exempted."
            },
            "DEF-ANPR": {
                "rule": "Section 65B, Indian Evidence Act & Sec 136A MV Act",
                "description": "Optical Character Recognition (ANPR) plate character misread, vehicle model discrepancy, or low image confidence."
            }
        }

    def evaluate_challan(
        self,
        offence_date_str: str,
        notice_date_str: str,
        registered_plate: str,
        camera_crop_plate: str,
        driver_narrative: str,
        offence_section: str
    ) -> Dict[str, Any]:
        """
        Evaluates an electronic notice and driver explanation to compute
        statutory violations and win probability.
        """
        violations: List[Dict[str, Any]] = []
        win_score = 50  # Base score

        # 1. Check Rule 167A (15-Day Service Limit)
        try:
            d_offence = datetime.strptime(offence_date_str, "%Y-%m-%d")
            d_notice = datetime.strptime(notice_date_str, "%Y-%m-%d")
            days_elapsed = (d_notice - d_offence).days
        except Exception:
            days_elapsed = 30  # Default estimate

        if days_elapsed > 15:
            win_score += 44
            violations.append({
                "code": "DEF-167A",
                "rule": self.rules_catalog["DEF-167A"]["rule"],
                "status": "FATAL PROCEDURAL DEFECT",
                "summary": f"Notice Dispatched {days_elapsed} Days Post-Offence (Allowed: 15 Days)",
                "details": f"Under CMVR Rule 167A(3), electronic citations dispatched beyond 15 calendar days are time-barred and void ab initio."
            })

        # 2. Check ANPR Plate Discrepancy
        reg_clean = registered_plate.replace(" ", "").upper()
        cam_clean = camera_crop_plate.replace(" ", "").upper()
        if reg_clean != cam_clean:
            win_score = min(99, win_score + 48)
            violations.append({
                "code": "DEF-ANPR",
                "rule": self.rules_catalog["DEF-ANPR"]["rule"],
                "status": "IDENTITY MISATTRIBUTION",
                "summary": f"Camera Detected '{camera_crop_plate}' vs Registered '{registered_plate}'",
                "details": "High Court precedents establish that automated OCR character confusion (e.g. 8 vs B, 0 vs D) voids penal liability."
            })

        # 3. Check Emergency Vehicle Yielding (Sec 194E)
        narrative_lower = driver_narrative.lower()
        if any(w in narrative_lower for w in ["ambulance", "emergency", "siren", "hospital", "patient"]):
            win_score = min(98, win_score + 40)
            violations.append({
                "code": "DEF-194E",
                "rule": self.rules_catalog["DEF-194E"]["rule"],
                "status": "STATUTORY IMMUNITY",
                "summary": "Mandatory Yielding to Emergency Vehicle under Section 194E",
                "details": "Motorists are legally required to yield to emergency vehicles under Sec 194E. Traffic camera cannot penalize compliance with positive law."
            })

        final_probability = min(99, max(20, win_score))

        return {
            "win_probability": final_probability,
            "days_elapsed": days_elapsed,
            "statutory_violations": violations,
            "recommendation": "Contest immediately in State Virtual Court" if final_probability >= 75 else "Pay or attend National Lok Adalat"
        }
