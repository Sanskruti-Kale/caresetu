# CareSetu 
> **“Aapki Sehat, Aapki Kahani.”**  
> *A personal health-record management platform that organizes scattered medical reports into a chronological, understandable health journey.*
<img width="1366" height="768" alt="WhatsApp Image 2026-10-06 at 12 57 30 AM" src="https://github.com/user-attachments/assets/ce8829ec-6ea5-4872-b550-4f9c76e46dcd" />
<img width="1366" height="768" alt="WhatsApp Image 2026-10-06 at 12 57 06 AM (1)" src="https://github.com/user-attachments/assets/903ba866-2f83-42a4-acfc-908fbe8cc2e4" />
<img width="1366" height="768" alt="WhatsApp Image 2026-10-06 at 12 56 53 AM" src="https://github.com/user-attachments/assets/59fe8598-76e1-47ab-8306-fea33241e6de" />


---

## Overview & Purpose
**CareSetu** solves the critical problem of fragmented healthcare records in India. Medical prescriptions, lab reports, and imaging tests are routinely scattered across WhatsApp chats, physical paper files, and email attachments. 

CareSetu creates an organized, patient-owned health journey without diagnosing diseases or replacing medical practitioners. All AI features are strictly **assistive** and operate under a **human-in-the-loop** protocol where category suggestions always require user confirmation.

---

## Live Local URLs
- **Frontend Web Application:** [http://localhost:5173/](http://localhost:5173/)
- **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Key Features & Modules

### 1. AI-Assisted Report Categorization (Strict Human-in-the-Loop)
- **File Support:** Accepts PDF, JPG, and PNG documents.
- **Workflow:**
  1. User selects or drops a medical document (or selects a quick sample test).
  2. OCR service parses text, extracting clinical markers (Hemoglobin, Fasting Sugar, BP, Cholesterol, Heart Rate).
  3. AI categorizer suggests the category with confidence rating and keyword tags.
  4. User reviews the suggested category and can **CONFIRM** or **CHANGE** it (Cardiology, Laboratory, Radiology, Orthopedics, General Medicine, Dental, Other).
  5. The report and timeline milestone are only committed to the database after explicit user confirmation.
- **Clinical Safety:** AI is strictly assistive. It never diagnoses diseases or alters prescriptions.

### 2. “What Changed?” (Record Comparison Engine)
- Compares any two selected records (e.g. Previous Consultation vs Recent Prescription).
- Identifies:
  - **Medications Added** (`+ Rosuvastatin 5mg`)
  - **Medications Discontinued / Removed** (`- Pantoprazole 40mg`)
  - **Continued Medications** (`✓ Telmisartan 20mg`)
  - **Numeric Parameter Deltas** (e.g. Blood Pressure: `138/88 mmHg` → `124/82 mmHg` [Normalized]).
- Disclaimer: Limited strictly to reliably extracted text. Never claims to interpret all clinical nuances.

### 3. Duration-Based Medicine Management
- **Course Duration Auto-Stop:** If a 15-day course is specified, reminder schedules automatically conclude after 15 days.
- **Today's Schedule:** Quick **Mark as Taken** and **Mark as Missed** actions.
- **Missed Dose Compliance Log:** Missed doses are logged transparently in history for doctor review. CareSetu never automatically alters prescribed dosages.

### 4. Family Zone (Children & Dependent Records)
- Prioritizes children and elderly dependents without independent smartphones or logins.
- Managed under legal parental guardianship while keeping dependent health records strictly separated from parent records.
- **Child Immunization Schedule:** Tracks standard vaccines (BCG, Polio, Hepatitis B, DTP, MMR, Typhoid) with **Given**, **Due Now**, and **Upcoming** status tags.

### 5. Doctor Consultation Brief & Consent-Based Sharing
- Compiles patient identity, known drug allergies, active medicines, recent lab parameters, and timeline highlights into a clean 1-page summary.
- **Print / PDF:** Direct printable view for offline clinic visits.
- **Explicit Consent Sharing:** Generates a secure, temporary 6-character access PIN (e.g. `CARE-9281`) valid for 24 hours.
- **Instant Revocation:** Patient can revoke doctor access at any second with a single click.
- **Doctor Verification Portal:** Dedicated tab where consulting doctors enter the PIN to review authorized patient summaries.

### 6.  Educational Report Guide
- Plain-language educational encyclopedia for common medical reports: ECG, Blood Test (CBC & Lipid), X-Ray, MRI, CT Scan, Ultrasound, and Blood Pressure.
- Explains what it is, why doctors order it, which specialist uses it, and basic preparation.

---

##  Project Architecture

```
caresetu/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with in-memory fallback
│   ├── controllers/
│   │   ├── authController.js     # Auth, RBAC, demo logins, profile & erasure
│   │   ├── reportController.js   # Staged OCR analysis, confirmation, CRUD
│   │   ├── medicineController.js # Course duration, reminders, dose logging
│   │   ├── timelineController.js # Chronological journey and filter engine
│   │   ├── dependentController.js# Children profiles & vaccine tracker
│   │   └── doctorBriefController.js # Consultation brief, consent & portal
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── uploadMiddleware.js   # Multer file upload & format validation
│   ├── models/
│   │   ├── User.js               # User & RBAC schema
│   │   ├── Report.js             # Reports with confirmed category & parameters
│   │   ├── Medicine.js           # Medicine duration & doseLogs schema
│   │   ├── TimelineEvent.js      # Health journey timeline schema
│   │   ├── Dependent.js          # Child & family profile schema
│   │   ├── Vaccination.js        # Child immunization schedule schema
│   │   └── DoctorConsent.js      # Explicit sharing consent schema
│   ├── routes/                   # Express REST API routes
│   ├── services/
│   │   ├── ocrService.js         # OCR text parsing & parameter extraction
│   │   ├── aiCategorizer.js      # Category taxonomy & confidence scoring
│   │   └── comparisonService.js  # "What Changed?" diff engine
│   ├── data/
│   │   ├── seedData.js           # Realistic dataset for hackathon viva
│   │   └── memoryStore.js        # Resilient offline/fallback in-memory store
│   ├── server.js                 # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg           # CareSetu logo
│   │   └── sample-reports/       # Test diagnostic PDFs
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation, dependent switcher, upload trigger
│   │   │   ├── Footer.jsx        # Footer with emergency medical advisory
│   │   │   ├── DisclaimerBanner.jsx # Clinical AI safety badge
│   │   │   ├── UploadModal.jsx   # 2-step AI-assisted upload modal
│   │   │   ├── ReportCard.jsx    # Report cards with parameters & quick view
│   │   │   ├── ViewReportModal.jsx # Full report detail & raw OCR inspection
│   │   │   └── ConfirmDialog.jsx # Reusable delete confirmation modal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication, demo login, session state
│   │   │   └── HealthContext.jsx # Reports, medicines, timeline, dependents
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, problem statement, features, security
│   │   │   ├── LoginPage.jsx     # Login + 1-Click demo evaluator buttons
│   │   │   ├── SignupPage.jsx    # Account registration
│   │   │   ├── ForgotPasswordPage.jsx # Password recovery
│   │   │   ├── DashboardPage.jsx # Stats, upcoming doses, timeline preview
│   │   │   ├── ReportsPage.jsx   # Category filter tabs, search, archive
│   │   │   ├── ComparisonPage.jsx# “What Changed?” baseline vs follow-up diff
│   │   │   ├── MedicinesPage.jsx # Duration tracking & missed dose log
│   │   │   ├── FamilyZonePage.jsx# Children records & vaccine schedule
│   │   │   ├── ReportGuidePage.jsx# Educational test dictionary
│   │   │   ├── DoctorBriefPage.jsx# Consultation brief, consent sharing, portal
│   │   │   └── ProfilePage.jsx   # Health identity, JSON export & data erasure
│   │   ├── services/
│   │   │   └── api.js            # REST API client
│   │   ├── styles/
│   │   │   └── index.css         # Modern healthcare design system
│   │   ├── App.jsx               # App layout & routing
│   │   └── main.jsx
│   ├── vite.config.js            # Vite config with backend proxy
│   └── package.json
└── README.md
```

---

##  How Frontend, Backend, Database and AI/OCR Communicate

```
+---------------------------------------------------------------------------------+
|                                 REACT FRONTEND                                  |
|  - User drops report (PDF/JPG/PNG)                                              |
|  - Or selects quick 1-click test sample                                         |
+---------------------------------------+-----------------------------------------+
                                        | (1) POST /api/reports/analyze (Multipart)
                                        v
+---------------------------------------------------------------------------------+
|                               EXPRESS BACKEND                                   |
|  1. uploadMiddleware: Validates file type (PDF/JPG/PNG) & file size             |
|  2. ocrService: Parses raw text & extracts parameters (BP, Sugar, Lipids)       |
|  3. aiCategorizer: Matches keywords, computes category & confidence score        |
+---------------------------------------+-----------------------------------------+
                                        | (2) Returns AI suggestion & confidence
                                        v
+---------------------------------------------------------------------------------+
|                         USER CONFIRMATION MODAL                                 |
|  - User sees: "Suggested Category: Laboratory (96% Confidence)"                 |
|  - User reviews extracted parameters                                            |
|  - User CONFIRMS or CHANGES category from dropdown                              |
|  - User clicks "Confirm Category & Save Report"                                 |
+---------------------------------------+-----------------------------------------+
                                        | (3) POST /api/reports/confirm-save
                                        v
+---------------------------------------------------------------------------------+
|                       DATABASE / PERSISTENCE LAYER                              |
|  - Saves confirmed report under User ID (or Child Dependent ID)                 |
|  - Automatically appends a corresponding milestone to Health Timeline           |
|  - Updates "What Changed?" baseline parameters & active medicine list           |
+---------------------------------------------------------------------------------+
```

---

## Pre-Seeded Demo Credentials for Evaluators

You do not need to register or type passwords during hackathon presentation:
- **Patient Demo:** Click **“Try Demo Patient”** on the Landing or Login page  
  *User: Rahul Sharma (`rahul@caresetu.in`), 34 Years, Mild Hypertension*  
  *Child Profile: Aarav Sharma, 6 Years, Pediatric Growth & Vaccines*
- **Doctor Demo:** Click **“ Try Demo Doctor”** on the Login page  
  *Doctor: Dr. Ananya Gupta (`dr.gupta@caresetu.in`), Cardiologist*
- **Pre-Generated Doctor Access PIN:** `CARE-9281` (can be tested in the Doctor Portal tab)

---

## Setup & Execution Instructions

### Prerequisites
- Node.js LTS (v18+)
- (Optional) MongoDB daemon running on `mongodb://127.0.0.1:27017/CareSetu`.  
  *(Note: If MongoDB is offline, CareSetu's built-in resilient in-memory data engine automatically activates with full persistence and realistic seed data).*

### 1. Installation
In the project root folder:
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 2. Environment Configuration
Backend `.env` file (`backend/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/CareSetu
JWT_SECRET=caresetu_super_secure_jwt_secret_2026
NODE_ENV=development
```

### 3. Running Locally
Terminal 1 (Backend):
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## Medical Disclaimer
CareSetu is an assistive personal health-record management application. It does not provide medical diagnoses, emergency care, or clinical prescriptions. Users should always consult a licensed medical doctor for health decisions.
