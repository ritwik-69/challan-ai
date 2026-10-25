export const DEMO_CHALLANS = [
  {
    id: 'delhi-speeding',
    title: 'Delhi: 49-Day Notice Delay',
    badge: 'CMVR 167A Violation',
    badgeType: 'badge-danger',
    city: 'New Delhi',
    state: 'NCT of Delhi',
    courtName: 'Virtual Court (Traffic), NCT of Delhi',
    authority: 'Delhi Traffic Police (E-Challan Branch)',
    challanNumber: 'DL-2024-8839210-SP',
    offenceSection: 'Section 112 / 183 Motor Vehicles Act (Over-Speeding)',
    fineAmount: 2000,
    offenceDate: '10 Aug 2024, 14:22:15 IST',
    noticeDate: '28 Sep 2024, 11:00:32 IST',
    daysElapsed: 49,
    statutoryLimitDays: 15,
    location: 'Barapullah Elevated Corridor, Near Sarai Kale Khan, New Delhi',
    registeredVehicle: {
      plate: 'DL 3C CS 8812',
      model: 'Honda City (Pearl White)',
      owner: 'Ritwik Patnaik',
      class: 'LMV / Motor Car'
    },
    cameraEvidence: {
      speedRecorded: '78 km/h',
      speedLimit: '60 km/h',
      cameraType: 'Fixed Doppler Radar (Truvelo D-Cam #412)',
      anprPlateDetected: 'DL 3C CS 8812',
      plateConfidence: '99.1%',
      visualDefects: ['Notice dispatched 34 days past statutory limit', 'No radar calibration seal attached']
    },
    driverStatement: 'Mera challan 49 din baad aaya hai. Central Motor Vehicle Rules ke niyam 167A ke tehat notice 15 dino ke andar bhejna mandatory hai. Itni deri ke baad ye challan legally voidable hai.',
    driverLang: 'Hindi / Hinglish',
    winProbability: 94,
    primaryGround: 'Procedural Invalidation under CMVR Rule 167A(3) — Statutory Service Bar',
    statutoryViolations: [
      {
        code: 'DEF-167A',
        rule: 'Rule 167A(3), Central Motor Vehicles Rules (CMVR)',
        status: 'VIOLATED (Fatal Defect)',
        summary: 'Electronic Notice Dispatched 49 Days After Offence (Allowed: 15 Days)',
        details: 'Under Central Motor Vehicles (Seventeenth Amendment) Rules, electronic enforcement notices must be sent within 15 calendar days. Notice DL-2024-8839210 was served after 49 days, rendering it legally non-est and procedurally time-barred as upheld by Delhi High Court.'
      },
      {
        code: 'DEF-CALIB',
        rule: 'Legal Metrology (General) Rules, 2011 Sec 15',
        status: 'UNVERIFIED',
        summary: 'Absence of Mandatory Annual Radar Calibration Certificate',
        details: 'Speed measurement by Doppler Radar #412 lacks a valid annual calibration verification certificate on the Parivahan evidence repository.'
      }
    ],
    discrepancyMatrix: [
      { field: 'Statutory Notice Window', challanRecord: '49 Days Elapsed', legalRequirement: 'Strictly Max 15 Days (Rule 167A)', status: 'Fatal Defect' },
      { field: 'Offence vs Notice Date', challanRecord: '10 Aug 2024 vs 28 Sep 2024', legalRequirement: 'Dispatched within 15 days', status: 'Violated' },
      { field: 'Radar Calibration Stamp', challanRecord: 'Not Appended in Notice', legalRequirement: 'Mandatory under Legal Metrology Act', status: 'Missing' }
    ],
    petitionDraft: `IN THE COURT OF THE METROPOLITAN MAGISTRATE
VIRTUAL TRAFFIC COURT, NCT OF DELHI

IN THE MATTER OF:
RITWIK PATNAIK
(Registered Owner of Vehicle No: DL 3C CS 8812)
...PETITIONER

VERSUS

STATE (DELHI TRAFFIC POLICE)
(Notice No: DL-2024-8839210-SP)
...RESPONDENT

APPLICATION UNDER SECTION 208 OF THE MOTOR VEHICLES ACT, 1988 READ WITH RULE 167A(3) OF THE CENTRAL MOTOR VEHICLES RULES, 1989 PRAYING FOR DISMISSAL/QUASHING OF E-CHALLAN

MOST RESPECTFULLY SHOWETH:
1. That the Petitioner is the registered owner of motor vehicle bearing registration number DL 3C CS 8812.
2. That on 28 September 2024, the Petitioner received an electronic challan alleging an overspeeding violation under Section 112/183 said to have occurred on 10 August 2024 on Barapullah Elevated Corridor.
3. FATAL PROCEDURAL DEFECT UNDER RULE 167A(3):
   Under Rule 167A(3) of the Central Motor Vehicles Rules (as amended in 2021), electronic notices generated through speed camera enforcement must be served to the registered owner within fifteen (15) days of the date of the alleged offence.
4. In the present case, a delay of 49 days has elapsed between the date of incident (10-08-2024) and the notice generation (28-09-2024), completely depriving the Petitioner of the right to contest timely photographic logs.
5. In view of the above statutory non-compliance, the impugned challan is void ab initio.

PRAYER:
Wherefore, it is most respectfully prayed that this Hon'ble Court may graciously be pleased to:
a) Dismiss and quash Challan No. DL-2024-8839210-SP;
b) Direct revocation of the penalty amount of Rs. 2,000/-.

PETITIONER
THROUGH CHALLANAI DEFENSE ADVOCATE PORTAL`,
    audioAdvisoryText: 'नमस्ते। आपके चालान नंबर DL-8839210 की जांच करने पर एक बहुत बड़ी कानूनी खामी मिली है। यह चालान घटना के 49 दिन बाद भेजा गया है, जबकि केंद्रीय मोटर वाहन नियम 167A के अनुसार नोटिस 15 दिनों के भीतर मिलना अनिवार्य है। आपकी जीत की संभावना 94 प्रतिशत है। हमने आपका याचिका ड्राफ्ट तैयार कर दिया है, जिसे आप सीधे वर्चुअल कोर्ट पोर्टल पर सबमिट कर सकते हैं।'
  },
  {
    id: 'blr-plate-mismatch',
    title: 'Bengaluru: ANPR 8 vs B Error',
    badge: 'Optical OCR Confusion',
    badgeType: 'badge-ai',
    city: 'Bengaluru',
    state: 'Karnataka',
    courtName: 'Virtual Court (Traffic), Bengaluru Urban',
    authority: 'Bengaluru Traffic Police (ITMS)',
    challanNumber: 'KA-2024-7741092-RL',
    offenceSection: 'Section 119 Motor Vehicles Act (Jumping Red Light)',
    fineAmount: 1000,
    offenceDate: '18 Sep 2024, 09:14:02 IST',
    noticeDate: '22 Sep 2024, 16:45:10 IST',
    daysElapsed: 4,
    statutoryLimitDays: 15,
    location: 'Silk Board Junction, Outer Ring Road, Bengaluru',
    registeredVehicle: {
      plate: 'KA 01 MG 8812',
      model: 'Hyundai i20 (Polar White)',
      owner: 'Ananya Sharma',
      class: 'Hatchback / LMV'
    },
    cameraEvidence: {
      speedRecorded: 'N/A (Signal Violation)',
      speedLimit: '0 km/h (Red Phase)',
      cameraType: 'ANPR Smart Junction Camera (Hikvision Pro)',
      anprPlateDetected: 'KA 01 MG BB12',
      plateConfidence: '71.4% (Low Confidence)',
      visualDefects: ['Character optical misread: 88 confused with BB', 'Vehicle body type in camera is a Sedan (Dzire), whereas registered vehicle is a Hatchback (i20)']
    },
    driverStatement: 'Sir photo me car Maruti Dzire dikh rahi hai jabki meri gadi Hyundai i20 hai. Plate pe BB12 likha hai aur mera number 8812 hai. Ye ANPR camera ka clear OCR error hai.',
    driverLang: 'Kannada / Hinglish',
    winProbability: 98,
    primaryGround: 'Identity Misattribution & Evidentiary Inadmissibility under Sec 65B Evidence Act',
    statutoryViolations: [
      {
        code: 'DEF-ANPR',
        rule: 'Section 65B, Indian Evidence Act & Section 136A MV Act',
        status: 'OPTICAL ERROR (Clear Misidentification)',
        summary: 'Camera OCR Confused "BB" with Registered "88"',
        details: 'The ANPR camera software misread plate characters "BB12" as "8812". Physical visual evidence reveals the offending vehicle is a Silver Maruti Dzire, whereas the registered owner possesses a White Hyundai i20.'
      }
    ],
    discrepancyMatrix: [
      { field: 'Number Plate Characters', challanRecord: 'KA 01 MG 8812 (Claimed)', legalRequirement: 'Camera Photo Shows KA 01 MG BB12', status: 'Direct Mismatch' },
      { field: 'Vehicle Body Type', challanRecord: 'Hyundai i20 (Registered)', legalRequirement: 'Camera Evidence shows Maruti Dzire', status: 'Wrong Vehicle' },
      { field: 'ANPR Confidence Score', challanRecord: '71.4% (Threshold: 90%)', legalRequirement: 'High-confidence uncorrupted image', status: 'Inadmissible' }
    ],
    petitionDraft: `IN THE COURT OF THE METROPOLITAN MAGISTRATE
VIRTUAL TRAFFIC COURT, BENGALURU

IN THE MATTER OF:
ANANYA SHARMA
(Registered Owner of Hyundai i20 bearing No: KA 01 MG 8812)
...PETITIONER

VERSUS

COMMISSIONER OF POLICE, BENGALURU TRAFFIC
(Challan Ref: KA-2024-7741092-RL)
...RESPONDENT

PETITION FOR CANCELLATION OF E-CHALLAN ON ACCOUNT OF OPTICAL CHARACTER RECOGNITION (ANPR) MISIDENTIFICATION

MOST RESPECTFULLY SHOWETH:
1. That the Petitioner is the lawful owner of Hyundai i20 Hatchback (White) bearing Reg. No. KA 01 MG 8812.
2. That the Respondent issued E-Challan No. KA-2024-7741092-RL alleging a red-light violation at Silk Board Junction.
3. CLEAR ANPR OPTICAL ERROR AND IDENTITY MISTAKE:
   Upon close scrutiny of the photograph annexed to the citation, the vehicle captured violating the signal is a Silver Maruti Suzuki Dzire Sedan bearing registration number KA 01 MG BB12.
4. The automated ITMS system erroneously read the digits 'BB' as '88' and automatically debited the citation to the Petitioner's registered mobile number.
5. Under Section 65B of the Indian Evidence Act, electronically generated evidence lacking photographic veracity cannot sustain a criminal penalty.

PRAYER:
It is therefore prayed that this Hon'ble Court be pleased to set aside Challan No. KA-2024-7741092-RL and purge the records against KA 01 MG 8812.

PETITIONER`,
    audioAdvisoryText: 'नमस्कार। आपके चालान में कैमरा सिस्टम की बहुत बड़ी गलती पकड़ी गई है। कैमरे के ओसीआर सॉफ्टवेयर ने नंबर प्लेट पर लिखे BB12 को आपकी गाड़ी का नंबर 8812 समझ लिया। इसके अलावा फोटो में दिख रही गाड़ी डिजायर है जबकि आपकी गाड़ी i20 है। आपकी जीत की संभावना 98 प्रतिशत है। हमने केस खारिज करने की अर्जी तैयार कर दी है।'
  },
  {
    id: 'mum-ambulance-yield',
    title: 'Mumbai: Ambulance Yield Exemption',
    badge: 'Sec 194E Exemption',
    badgeType: 'badge-success',
    city: 'Mumbai',
    state: 'Maharashtra',
    courtName: 'Virtual Traffic Court, Greater Mumbai',
    authority: 'Mumbai Traffic Police (HQ Worli)',
    challanNumber: 'MH-2024-5519820-ST',
    offenceSection: 'Section 119 & 177 MV Act (Stop Line / Zebra Crossing Violation)',
    fineAmount: 500,
    offenceDate: '02 Oct 2024, 17:35:44 IST',
    noticeDate: '05 Oct 2024, 10:12:00 IST',
    daysElapsed: 3,
    statutoryLimitDays: 15,
    location: 'Dadar TT Circle, Dr. B.A. Road, Dadar, Mumbai',
    registeredVehicle: {
      plate: 'MH 01 DE 4490',
      model: 'Tata Nexon (Foliage Green)',
      owner: 'Vikram Deshmukh',
      class: 'SUV / LMV'
    },
    cameraEvidence: {
      speedRecorded: '12 km/h',
      speedLimit: 'Stop Line Position',
      cameraType: 'RLVD Intersection Camera #12B',
      anprPlateDetected: 'MH 01 DE 4490',
      plateConfidence: '98.5%',
      visualDefects: ['Rear vehicle in frame is an active Emergency 108 Ambulance with roof beacon flashers visible']
    },
    driverStatement: 'Dadar circle pe signal red tha lekin mere theek peeche 108 ambulance siren baja rahi thi. Ambulance ko rasta dene ke liye maine car aage badhake zebra crossing pe side me lagai. Section 194E ke tehat emergency vehicle ko rasta dena mandatory hai.',
    driverLang: 'Marathi / Hindi',
    winProbability: 91,
    primaryGround: 'Statutory Right-of-Way Duty under Section 194E & Doctrine of Necessity',
    statutoryViolations: [
      {
        code: 'DEF-194E',
        rule: 'Section 194E, Motor Vehicles (Amendment) Act 2019',
        status: 'STATUTORY EXEMPTION',
        summary: 'Mandatory Legal Duty to Yield Right-of-Way to Emergency Ambulance',
        details: 'Section 194E creates a strict legal liability on every driver to draw to the side of the road to clear passage for emergency vehicles. Crossing the stop-line was legally mandated and protected under the Doctrine of Necessity.'
      }
    ],
    discrepancyMatrix: [
      { field: 'Emergency Vehicle Presence', challanRecord: 'Ignored by Algorithm', legalRequirement: 'Mandatory Section 194E Exemption', status: 'Valid Exemption' },
      { field: 'Driver Action', challanRecord: 'Zebra Crossing Violation', legalRequirement: 'Safe yielding maneuver', status: 'Legally Protected' }
    ],
    petitionDraft: `IN THE COURT OF THE METROPOLITAN MAGISTRATE
VIRTUAL TRAFFIC COURT, GREATER MUMBAI

IN THE MATTER OF:
VIKRAM DESHMUKH
(Owner of Vehicle No: MH 01 DE 4490)
...APPLICANT

VERSUS

STATE OF MAHARASHTRA
(Mumbai Traffic Control Branch, Challan No: MH-2024-5519820-ST)
...RESPONDENT

DISPUTE PETITION UNDER SECTION 194E READ WITH DOCTRINE OF NECESSITY AGAINST STOP-LINE CITATION

RESPECTFULLY SUBMITTED:
1. The Applicant was driving vehicle MH 01 DE 4490 at Dadar TT Circle on 02-10-2024.
2. The automated Red Light Violation Detection (RLVD) camera triggered a penalty for crossing the stop-line.
3. STATUTORY DUTY UNDER SECTION 194E:
   The Applicant was yielding right-of-way to an Emergency 108 Ambulance carrying a critical patient with active siren and beacon lights immediately behind the Applicant's vehicle.
4. Section 194E of the Motor Vehicles Act makes failure to facilitate emergency vehicles a non-compoundable offence punishable with imprisonment or fine up to Rs. 10,000.
5. The Applicant acted in compliance with positive statutory law.

PRAYER:
It is prayed that the citation MH-2024-5519820-ST be summarily dropped.

APPLICANT`,
    audioAdvisoryText: 'नमस्कार! दादर जंक्शन वरील तुमचा चालान आम्ही तपासला आहे. तुम्ही रुग्णवाहिकेला रस्ता देण्यासाठी पुढे झाला होतात. मोटार वाहन कायद्याच्या कलम 194E नुसार इमर्जन्सी रुग्णवाहिकेला रस्ता देणे कायदेशीर बंधन आहे. कॅमेरा अल्गोरिदमला हे समजत नाही. तुमची केस 91 टक्के जिंकेल. आम्ही अर्ज तयार केला आहे, तो कोर्टात सादर करा.'
  }
];
