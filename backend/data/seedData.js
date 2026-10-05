// Realistic pre-seeded data for CareSetu
// Tailored for high-impact hackathon presentation & viva evaluation

const initialUser = {
  _id: "user_rahul_01",
  name: "Rahul Sharma",
  email: "rahul@caresetu.in",
  password: "password123", // in production hashed
  role: "patient",
  phone: "+91 98765 43210",
  bloodGroup: "B+",
  dateOfBirth: "1990-04-12",
  gender: "Male",
  allergies: ["Penicillin", "Sulfa drugs"],
  chronicConditions: ["Mild Hypertension (controlled)", "Seasonal Allergic Rhinitis"],
  emergencyContact: {
    name: "Pooja Sharma",
    phone: "+91 98765 12345",
    relation: "Spouse"
  },
  createdAt: new Date("2026-01-10T10:00:00Z")
};

const initialDoctor = {
  _id: "doc_gupta_01",
  name: "Dr. Ananya Gupta",
  email: "dr.gupta@caresetu.in",
  password: "password123",
  role: "doctor",
  phone: "+91 91234 56789",
  specialty: "Cardiology",
  hospital: "Apollo Heart Institute, New Delhi",
  registrationNumber: "MCI-48291",
  createdAt: new Date("2026-01-05T09:00:00Z")
};

const initialDependents = [
  {
    _id: "dep_aarav_01",
    userId: "user_rahul_01",
    name: "Aarav Sharma",
    relationship: "Child",
    dateOfBirth: "2020-08-15", // 6 years old
    gender: "Male",
    bloodGroup: "B+",
    allergies: ["Peanuts (Mild)"],
    pediatrician: "Dr. Sandeep Verma (Child Care Clinic)",
    notes: "Regular milestone checks completed. School health check up due in November.",
    createdAt: new Date("2026-01-12T11:00:00Z")
  },
  {
    _id: "dep_kamlesh_02",
    userId: "user_rahul_01",
    name: "Kamlesh Sharma",
    relationship: "Parent",
    dateOfBirth: "1958-11-20", // 67 years old
    gender: "Female",
    bloodGroup: "O+",
    allergies: ["Aspirin"],
    pediatrician: "Dr. Vinod Mehta (Geriatric & Internal Med)",
    notes: "Under regular monitoring for Type 2 Diabetes and Osteoarthritis.",
    createdAt: new Date("2026-02-01T15:30:00Z")
  }
];

const initialReports = [
  {
    _id: "rep_01",
    userId: "user_rahul_01",
    dependentId: null, // Rahul's own report
    title: "Complete Blood Count (CBC) & Lipid Profile",
    category: "Laboratory",
    doctorName: "Dr. Rajesh K. Nair",
    hospitalOrLab: "Dr. Lal PathLabs, Connaught Place",
    dateOfReport: new Date("2026-08-20"),
    fileUrl: "/sample-reports/cbc_lipid_report.pdf",
    fileName: "CBC_Lipid_Aug2026.pdf",
    fileType: "pdf",
    fileSize: 452000,
    ocrExtractedText: `DR. LAL PATHLABS - PATIENT REPORT
Patient Name: Rahul Sharma | Age/Gender: 34 Y / M | Ref By: Dr. Rajesh K. Nair
Test: Complete Blood Count & Fasting Lipid Panel
Hemoglobin: 14.8 g/dL (Ref: 13.0 - 17.0) - NORMAL
Total Leucocyte Count (TLC): 7,400 /cumm (Ref: 4,000 - 11,000) - NORMAL
Platelet Count: 240,000 /cumm (Ref: 150,000 - 450,000) - NORMAL
Fasting Blood Sugar: 98 mg/dL (Ref: 70 - 99) - NORMAL
Total Cholesterol: 215 mg/dL (Ref: < 200) - BORDERLINE HIGH
Triglycerides: 165 mg/dL (Ref: < 150) - BORDERLINE HIGH
HDL Cholesterol: 44 mg/dL (Ref: > 40) - NORMAL
LDL Cholesterol: 138 mg/dL (Ref: < 100) - ELEVATED
Summary: Mild dyslipidemia observed. Dietary modifications and brisk walking recommended.`,
    aiSuggestedCategory: "Laboratory",
    aiConfidence: 0.96,
    aiExtractedKeywords: ["Blood Count", "Lipid Profile", "Cholesterol", "Hemoglobin", "Triglycerides"],
    userConfirmedCategory: true,
    extractedParameters: [
      { key: "Hemoglobin", value: "14.8", unit: "g/dL", referenceRange: "13.0 - 17.0", status: "normal" },
      { key: "Platelets", value: "240,000", unit: "/cumm", referenceRange: "150,000 - 450,000", status: "normal" },
      { key: "Fasting Blood Sugar", value: "98", unit: "mg/dL", referenceRange: "70 - 99", status: "normal" },
      { key: "Total Cholesterol", value: "215", unit: "mg/dL", referenceRange: "< 200", status: "high" },
      { key: "Triglycerides", value: "165", unit: "mg/dL", referenceRange: "< 150", status: "high" },
      { key: "LDL Cholesterol", value: "138", unit: "mg/dL", referenceRange: "< 100", status: "high" }
    ],
    extractedMedications: [],
    notes: "Follow-up test after 3 months of low-carb diet advised.",
    createdAt: new Date("2026-08-20T14:30:00Z")
  },
  {
    _id: "rep_02",
    userId: "user_rahul_01",
    dependentId: null,
    title: "12-Lead Electrocardiogram (ECG) Report",
    category: "Cardiology",
    doctorName: "Dr. Ananya Gupta",
    hospitalOrLab: "Apollo Heart Institute",
    dateOfReport: new Date("2026-08-24"),
    fileUrl: "/sample-reports/ecg_apollo.pdf",
    fileName: "ECG_Resting_Aug2026.pdf",
    fileType: "pdf",
    fileSize: 380000,
    ocrExtractedText: `APOLLO HEART INSTITUTE - CARDIAC DIAGNOSTIC REPORT
Patient: Rahul Sharma | Age: 34 | ID: AP-78401 | Date: 24-Aug-2026
Test: Resting 12-Lead ECG
Heart Rate: 74 bpm (Regular Sinus Rhythm)
PR Interval: 152 ms | QRS Duration: 88 ms | QTc: 412 ms
P-wave: Normal morphology
ST-T Segment: No acute ST elevation or depression. No pathological Q waves.
Blood Pressure at test: 138/88 mmHg.
Conclusion: Normal Resting ECG with regular sinus rhythm. Mild resting systolic BP elevation noted.
Advice: Prescribed Telmisartan 20mg once daily in morning. Recheck BP in 2 weeks.`,
    aiSuggestedCategory: "Cardiology",
    aiConfidence: 0.98,
    aiExtractedKeywords: ["ECG", "Sinus Rhythm", "Heart Rate", "QTc", "Cardiology", "Telmisartan"],
    userConfirmedCategory: true,
    extractedParameters: [
      { key: "Heart Rate", value: "74", unit: "bpm", referenceRange: "60 - 100", status: "normal" },
      { key: "PR Interval", value: "152", unit: "ms", referenceRange: "120 - 200", status: "normal" },
      { key: "Blood Pressure", value: "138/88", unit: "mmHg", referenceRange: "< 120/80", status: "high" }
    ],
    extractedMedications: [
      { name: "Telmisartan", dosage: "20 mg", instruction: "Once daily morning after food" }
    ],
    notes: "Routine cardiac screening after reporting mild exertion fatigue.",
    createdAt: new Date("2026-08-24T17:00:00Z")
  },
  {
    _id: "rep_03",
    userId: "user_rahul_01",
    dependentId: null,
    title: "Cardiology Follow-up & Updated Prescription",
    category: "Cardiology",
    doctorName: "Dr. Ananya Gupta",
    hospitalOrLab: "Apollo Heart Institute",
    dateOfReport: new Date("2026-09-28"),
    fileUrl: "/sample-reports/prescription_sep2026.pdf",
    fileName: "Prescription_Followup_Sep2026.pdf",
    fileType: "pdf",
    fileSize: 290000,
    ocrExtractedText: `APOLLO HEART INSTITUTE - OUTPATIENT PRESCRIPTION
Patient: Rahul Sharma | Date: 28-Sep-2026 | Dr. Ananya Gupta (Cardiologist)
Clinical Assessment: Follow-up after 1 month.
Vitals: BP: 124/82 mmHg (Well controlled), Pulse: 72 bpm, Weight: 76.5 kg.
Current Review:
- Telmisartan 20 mg: Patient compliant. BP improved from 138/88 to 124/82. Continue same.
- Added Rosuvastatin 5 mg: To manage LDL elevation from August lipid test.
- Discontinued Pantoprazole 40 mg: Heartburn symptoms resolved.
Rx:
1. Tab Telmisartan 20 mg - 1 Tab once daily (Morning) - 30 days
2. Tab Rosuvastatin 5 mg - 1 Tab once daily (Night at bedtime) - 30 days
Next visit: After 2 months with repeat lipid profile.`,
    aiSuggestedCategory: "Cardiology",
    aiConfidence: 0.94,
    aiExtractedKeywords: ["Prescription", "Telmisartan", "Rosuvastatin", "Cardiology", "Blood Pressure"],
    userConfirmedCategory: true,
    extractedParameters: [
      { key: "Blood Pressure", value: "124/82", unit: "mmHg", referenceRange: "< 120/80", status: "normal" },
      { key: "Pulse Rate", value: "72", unit: "bpm", referenceRange: "60 - 100", status: "normal" },
      { key: "Weight", value: "76.5", unit: "kg", referenceRange: "N/A", status: "normal" }
    ],
    extractedMedications: [
      { name: "Telmisartan", dosage: "20 mg", instruction: "1 tab daily morning" },
      { name: "Rosuvastatin", dosage: "5 mg", instruction: "1 tab daily night at bedtime" }
    ],
    notes: "Compare this with Aug 24 report using 'What Changed?' to see medication changes and BP improvement!",
    createdAt: new Date("2026-09-28T11:15:00Z")
  },
  {
    _id: "rep_04",
    userId: "user_rahul_01",
    dependentId: "dep_aarav_01", // Aarav (Child)
    title: "Pediatric Wellness & Growth Assessment",
    category: "General Medicine",
    doctorName: "Dr. Sandeep Verma",
    hospitalOrLab: "Child Care Pediatric Clinic",
    dateOfReport: new Date("2026-09-10"),
    fileUrl: "/sample-reports/aarav_pediatric_check.pdf",
    fileName: "Aarav_Annual_Pediatric_Sep2026.pdf",
    fileType: "pdf",
    fileSize: 310000,
    ocrExtractedText: `CHILD CARE PEDIATRIC CLINIC
Child: Aarav Sharma | Age: 6 Years | Father: Rahul Sharma
Height: 118 cm (55th percentile) | Weight: 21.4 kg (50th percentile)
Vision: Normal 6/6 | Hearing: Normal bilaterally | Chest: Clear
Vaccination Status: Up to date for 5-year booster (DTP/Polio booster given on schedule).
Recommended: Annual Flu Vaccine (Influenza) and MMR second booster review.
Advice: Balanced diet with milk, eggs, green veggies. Vitamin D3 drops 400 IU daily for 3 months.`,
    aiSuggestedCategory: "General Medicine",
    aiConfidence: 0.95,
    aiExtractedKeywords: ["Pediatric", "Child Growth", "Height", "Weight", "Vaccination", "Vitamin D3"],
    userConfirmedCategory: true,
    extractedParameters: [
      { key: "Height", value: "118", unit: "cm", referenceRange: "110 - 124", status: "normal" },
      { key: "Weight", value: "21.4", unit: "kg", referenceRange: "18.0 - 24.0", status: "normal" },
      { key: "Temperature", value: "98.4", unit: "°F", referenceRange: "97.5 - 99.0", status: "normal" }
    ],
    extractedMedications: [
      { name: "Vitamin D3 Drops", dosage: "400 IU", instruction: "Once daily morning with milk" }
    ],
    notes: "Child healthy and milestones on track.",
    createdAt: new Date("2026-09-10T16:00:00Z")
  }
];

const initialMedicines = [
  {
    _id: "med_01",
    userId: "user_rahul_01",
    dependentId: null,
    name: "Telmisartan",
    dosage: "20 mg (1 Tablet)",
    frequency: "Once daily",
    startDate: new Date("2026-08-25"),
    durationDays: 60,
    endDate: new Date("2026-10-24"), // Reminders stop after duration
    reminderTimes: ["08:30 AM"],
    instructions: "After breakfast",
    prescribedBy: "Dr. Ananya Gupta",
    status: "active",
    notes: "For blood pressure control. Do not skip.",
    doseLogs: [
      { date: new Date("2026-10-05"), time: "08:30 AM", status: "taken", loggedAt: new Date("2026-10-05T08:35:00Z"), notes: "Taken on time" },
      { date: new Date("2026-10-04"), time: "08:30 AM", status: "taken", loggedAt: new Date("2026-10-04T08:42:00Z"), notes: "Taken with breakfast" },
      { date: new Date("2026-10-03"), time: "08:30 AM", status: "missed", loggedAt: new Date("2026-10-03T11:00:00Z"), notes: "Delayed travel morning; recorded as missed dose in log." }
    ],
    createdAt: new Date("2026-08-25T08:00:00Z")
  },
  {
    _id: "med_02",
    userId: "user_rahul_01",
    dependentId: null,
    name: "Rosuvastatin",
    dosage: "5 mg (1 Tablet)",
    frequency: "Once daily",
    startDate: new Date("2026-09-29"),
    durationDays: 30,
    endDate: new Date("2026-10-29"),
    reminderTimes: ["09:30 PM"],
    instructions: "At bedtime",
    prescribedBy: "Dr. Ananya Gupta",
    status: "active",
    notes: "Cholesterol management. Take after light dinner.",
    doseLogs: [
      { date: new Date("2026-10-04"), time: "09:30 PM", status: "taken", loggedAt: new Date("2026-10-04T21:40:00Z"), notes: "Taken before sleep" },
      { date: new Date("2026-10-03"), time: "09:30 PM", status: "taken", loggedAt: new Date("2026-10-03T21:30:00Z"), notes: "Taken on time" }
    ],
    createdAt: new Date("2026-09-29T10:00:00Z")
  },
  {
    _id: "med_03",
    userId: "user_rahul_01",
    dependentId: "dep_aarav_01", // For child Aarav
    name: "Vitamin D3 (Cholecalciferol)",
    dosage: "400 IU (0.5 mL)",
    frequency: "Once daily",
    startDate: new Date("2026-09-12"),
    durationDays: 90,
    endDate: new Date("2026-12-11"),
    reminderTimes: ["08:00 AM"],
    instructions: "With morning milk",
    prescribedBy: "Dr. Sandeep Verma",
    status: "active",
    notes: "Pediatric bone health & immunity supplement.",
    doseLogs: [
      { date: new Date("2026-10-05"), time: "08:00 AM", status: "taken", loggedAt: new Date("2026-10-05T08:10:00Z"), notes: "Given by parent" },
      { date: new Date("2026-10-04"), time: "08:00 AM", status: "taken", loggedAt: new Date("2026-10-04T08:15:00Z"), notes: "Given by parent" }
    ],
    createdAt: new Date("2026-09-12T09:00:00Z")
  },
  {
    _id: "med_04",
    userId: "user_rahul_01",
    dependentId: null,
    name: "Pantoprazole",
    dosage: "40 mg",
    frequency: "Once daily",
    startDate: new Date("2026-08-01"),
    durationDays: 15,
    endDate: new Date("2026-08-16"),
    reminderTimes: ["07:30 AM"],
    instructions: "Empty stomach in morning",
    prescribedBy: "Dr. Rajesh K. Nair",
    status: "completed", // Course ended after 15 days
    notes: "15-day course completed. Reminders stopped automatically on Aug 16.",
    doseLogs: [
      { date: new Date("2026-08-15"), time: "07:30 AM", status: "taken", loggedAt: new Date("2026-08-15T07:35:00Z"), notes: "Final dose completed" }
    ],
    createdAt: new Date("2026-08-01T07:00:00Z")
  }
];

const initialTimelineEvents = [
  {
    _id: "evt_01",
    userId: "user_rahul_01",
    dependentId: null,
    eventType: "report",
    title: "Complete Blood Count & Fasting Lipid Panel",
    date: new Date("2026-08-20"),
    category: "Laboratory",
    doctorOrSpecialty: "Dr. Rajesh K. Nair (Internal Medicine)",
    description: "Lab tests revealed borderline elevated LDL and total cholesterol. Routine CBC values normal.",
    relatedReportId: "rep_01",
    vitals: { glucose: "98 mg/dL", cholesterol: "215 mg/dL" },
    icon: "activity",
    createdAt: new Date("2026-08-20T14:30:00Z")
  },
  {
    _id: "evt_02",
    userId: "user_rahul_01",
    dependentId: null,
    eventType: "visit",
    title: "Cardiology Consultation & Resting 12-Lead ECG",
    date: new Date("2026-08-24"),
    category: "Cardiology",
    doctorOrSpecialty: "Dr. Ananya Gupta (Cardiology)",
    description: "Evaluated for mild exertion fatigue. ECG was normal sinus rhythm; resting blood pressure was 138/88 mmHg. Started Telmisartan 20mg.",
    relatedReportId: "rep_02",
    vitals: { bp: "138/88 mmHg", pulse: "74 bpm" },
    icon: "heart",
    createdAt: new Date("2026-08-24T17:00:00Z")
  },
  {
    _id: "evt_03",
    userId: "user_rahul_01",
    dependentId: null,
    eventType: "medicine",
    title: "Started Telmisartan 20mg Once Daily",
    date: new Date("2026-08-25"),
    category: "General Medicine",
    doctorOrSpecialty: "Dr. Ananya Gupta",
    description: "Added to daily medicine schedule. Reminders set for 08:30 AM every morning after breakfast.",
    relatedMedicineId: "med_01",
    vitals: {},
    icon: "pill",
    createdAt: new Date("2026-08-25T08:00:00Z")
  },
  {
    _id: "evt_04",
    userId: "user_rahul_01",
    dependentId: null,
    eventType: "visit",
    title: "Cardiology Follow-up - Blood Pressure Improved",
    date: new Date("2026-09-28"),
    category: "Cardiology",
    doctorOrSpecialty: "Dr. Ananya Gupta (Cardiology)",
    description: "BP normalized to 124/82 mmHg. Added Rosuvastatin 5mg for cholesterol management. Discontinued Pantoprazole.",
    relatedReportId: "rep_03",
    vitals: { bp: "124/82 mmHg", pulse: "72 bpm", weight: "76.5 kg" },
    icon: "check-circle",
    createdAt: new Date("2026-09-28T11:15:00Z")
  },
  {
    _id: "evt_05",
    userId: "user_rahul_01",
    dependentId: "dep_aarav_01",
    eventType: "visit",
    title: "Aarav: Annual Pediatric Growth Check",
    date: new Date("2026-09-10"),
    category: "General Medicine",
    doctorOrSpecialty: "Dr. Sandeep Verma (Pediatrics)",
    description: "Height 118cm, weight 21.4kg. Healthy growth percentiles. Prescribed Vitamin D3 drops.",
    relatedReportId: "rep_04",
    vitals: { height: "118 cm", weight: "21.4 kg" },
    icon: "smile",
    createdAt: new Date("2026-09-10T16:00:00Z")
  }
];

const initialVaccinations = [
  {
    _id: "vac_01",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "BCG (Tuberculosis)",
    targetAge: "At birth",
    scheduledDate: new Date("2020-08-15"),
    givenDate: new Date("2020-08-16"),
    status: "given",
    administeredBy: "Fortis Memorial Hospital, Gurugram",
    batchNumber: "BCG-2020-891",
    notes: "Left arm intradermal scar present."
  },
  {
    _id: "vac_02",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "OPV & Hepatitis B (Birth Dose)",
    targetAge: "At birth",
    scheduledDate: new Date("2020-08-15"),
    givenDate: new Date("2020-08-16"),
    status: "given",
    administeredBy: "Fortis Memorial Hospital",
    batchNumber: "HEP-B-4412",
    notes: "Given uneventfully."
  },
  {
    _id: "vac_03",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "Pentavalent 1 + IPV 1 + Rotavirus",
    targetAge: "6 Weeks",
    scheduledDate: new Date("2020-09-28"),
    givenDate: new Date("2020-09-29"),
    status: "given",
    administeredBy: "Dr. Sandeep Verma Clinic",
    batchNumber: "PNT-0982",
    notes: "Mild fever treated with Paracetamol drops."
  },
  {
    _id: "vac_04",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "DTP Booster 1 + OPV Booster",
    targetAge: "16-24 Months",
    scheduledDate: new Date("2022-02-15"),
    givenDate: new Date("2022-02-20"),
    status: "given",
    administeredBy: "Dr. Sandeep Verma Clinic",
    batchNumber: "DTP-B1-771",
    notes: "Tolerance good."
  },
  {
    _id: "vac_05",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "DTP Booster 2 (School Entry)",
    targetAge: "5-6 Years",
    scheduledDate: new Date("2025-08-15"),
    givenDate: new Date("2025-08-20"),
    status: "given",
    administeredBy: "Dr. Sandeep Verma Clinic",
    batchNumber: "DTP-B2-9902",
    notes: "Given at 5 years. Certificate provided for school."
  },
  {
    _id: "vac_06",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "Typhoid Conjugate Booster",
    targetAge: "6 Years",
    scheduledDate: new Date("2026-11-15"),
    givenDate: null,
    status: "upcoming",
    administeredBy: "Dr. Sandeep Verma Clinic",
    batchNumber: "",
    notes: "Scheduled for November pediatrician visit."
  },
  {
    _id: "vac_07",
    dependentId: "dep_aarav_01",
    userId: "user_rahul_01",
    vaccineName: "Annual Influenza Vaccine (Flu Shot)",
    targetAge: "Annual (Pre-Winter)",
    scheduledDate: new Date("2026-10-15"),
    givenDate: null,
    status: "due",
    administeredBy: "Child Care Clinic",
    batchNumber: "",
    notes: "Due this month before winter smog and seasonal flu surge."
  }
];

const initialDoctorConsents = [
  {
    _id: "con_01",
    userId: "user_rahul_01",
    doctorName: "Dr. Ananya Gupta",
    doctorEmail: "dr.gupta@caresetu.in",
    accessCode: "CARE-9281",
    sharedSections: { reports: true, medicines: true, timeline: true, dependents: false },
    dependentId: null, // User self records
    expiresAt: new Date("2026-10-06T23:59:59Z"),
    status: "active",
    consentGrantedAt: new Date("2026-10-05T09:00:00Z"),
    revokedAt: null,
    accessLog: [
      { accessedAt: new Date("2026-10-05T10:14:00Z"), ip: "103.21.244.12", action: "Viewed Doctor Brief & Cardiology Reports" }
    ]
  }
];

module.exports = {
  initialUser,
  initialDoctor,
  initialDependents,
  initialReports,
  initialMedicines,
  initialTimelineEvents,
  initialVaccinations,
  initialDoctorConsents
};
