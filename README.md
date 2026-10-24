# MedConnect — Frontend-Only Medical Teleconsultation Platform

MedConnect is a responsive, professional healthcare teleconsultation web application built with **React**, **TypeScript**, **Vite**, and **JSON Server**. It provides an interactive clinical prototype demonstrating end-to-end patient doctor discovery, rules-based symptom triage support, simulated teleconsultation, pharmaceutical compliance validation, and medical board credential verification.

---

## 🌟 Key Features

### 1. Doctor Discovery & Profiles (`/doctors`, `/doctors/:id`)
- **Verified Practitioner Filtering**: Patient-facing directory only displays medical board approved doctors with verification badges.
- **Multi-parameter Filtering**: Filter by medical specialty, clinic location, and active online availability.
- **Doctor Profiles**: Displays qualifications, board certifications, years of experience, patient reviews, fees, and available slot windows.

### 2. Interactive Clinical Symptom Checker (`/symptoms`)
- **Common Symptoms Cloud & Tagging**: Select presenting symptoms or input custom symptoms with duration and severity.
- **Red-Flag Emergency Safety Override**: Hardcoded safety interceptor detects critical signs (e.g. crushing chest pain, acute respiratory distress, stroke signs) and immediately suspends regular triage, displaying an emergency 911 banner.
- **Decision-Support Output**: Evaluates keyword clusters against mock clinical assessments, suggesting matching specialties and verified physicians.

### 3. Slot Booking & My Appointments (`/book/:doctorId`, `/appointments`)
- **Interactive Calendar & Slot Picker**: Select open date and time slots from mock physician schedules.
- **Persistent Bookings**: Sends `POST /appointments` to JSON Server, issuing a unique booking confirmation.
- **Encounter Tracking**: Filter appointments by status (`Confirmed`, `Completed`, `Cancelled`) with direct links to the teleconsultation room.

### 4. Teleconsultation Room (`/consultations/:appointmentId`)
- **Simulated Video Feed**: Doctor video preview with simulated audio wave visualizer, HD stream indicator, call timer, Picture-in-Picture patient self-view, and interactive media controls (mute, camera toggle, screen share, conclude call).
- **Interactive Encrypted Chat**: Live message thread with instant doctor response simulation.
- **Consultation Hand-off**: Conclude consultation and transition directly into clinical prescription drafting.

### 5. Prescription Generator & Compliance Engine (`/prescriptions/new`)
- **Encounter Context**: Pre-populated with patient and attending doctor credentials.
- **Rules-Based Drug Compliance Demonstration**: Hardcoded safety rules restrict prescribing Schedule II controlled narcotics (e.g. Morphine, Oxycodone, Fentanyl, Diazepam) over teleconsultation. Any restricted drug triggers a prominent compliance alert and blocks finalization until resolved.
- **Printable Clinical e-Prescription**: Formats a formal prescription document with doctor license details, Rx table, and browser printing support (`window.print()`).

### 6. Doctor Onboarding & Admin Verification (`/doctor-register`, `/admin/verification`)
- **Doctor Onboarding Form**: Submits qualifications and medical license document, defaulting to `pending` status.
- **Medical Board Admin Portal**: Administrative interface to review credential submissions.
- **Instant Discovery Reflection**: Approving or rejecting a doctor via `PATCH /doctors/:id` immediately reflects in the patient doctor discovery directory.

### 7. Role Switcher & Authentication (`/login`, `/register`)
- **Reviewer-Friendly Role Switcher**: Quick-switch between **Patient**, **Doctor**, and **Admin** modes from the navigation bar or Login page.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript
- **Bundler & Dev Server**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Vanilla CSS Design System with custom healthcare tokens in `src/index.css`
- **Icons**: Lucide React
- **Mock REST API**: JSON Server (`db.json`)
- **Typography**: Google Fonts (*Plus Jakarta Sans*, *Inter*)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended; tested on v22.14)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Installation

Clone or open the repository directory in your terminal and install dependencies:

```bash
npm install
```

---

## 💻 Running the Application

The project requires two terminal windows to run concurrently:

### Terminal 1: Mock REST API Server

Starts JSON Server on port `5001` using `db.json`:

```bash
npm run dev:api
```

> **API Endpoint:** `http://localhost:5001`  
> Resources: `/doctors`, `/patients`, `/appointments`, `/consultations`, `/prescriptions`, `/symptomAssessments`

### Terminal 2: Vite Development Server

Starts the React frontend development server:

```bash
npm run dev
```

> **Web Application:** `http://localhost:5173/`

---

## 👤 Demo Accounts & Credentials

For evaluation and project review, convenient demo accounts are built in:

| Role | Name | Email | Associated ID |
| :--- | :--- | :--- | :--- |
| **Patient** | Alex Johnson | `alex.johnson@example.com` | `pat-1` |
| **Doctor** | Dr. Sarah Mitchell | `sarah.mitchell@medconnect.demo` | `doc-1` (Cardiology) |
| **Doctor** | Dr. Marcus Vance | `marcus.vance@medconnect.demo` | `doc-2` (Dermatology) |
| **Admin** | Medical Board Reviewer | `admin@medconnect.demo` | `usr-adm-1` |

> 💡 **Tip:** You can switch between roles at any time using the **Role Switcher** badge in the top right of the navigation bar or via the 1-click buttons on `/login`.

---

## 🗺️ Application Routes

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage` | Landing page, hero, specialties, featured doctors, and workflow |
| `/doctors` | `FindDoctorsPage` | Doctor discovery with search and specialty/location filters |
| `/doctors/:id` | `DoctorDetailsPage` | Doctor clinical bio, schedule, and slot selection |
| `/symptoms` | `SymptomCheckerPage` | Symptom assessment with emergency override demonstration |
| `/book/:doctorId` | `BookingPage` | Slot confirmation and appointment booking submission |
| `/appointments` | `AppointmentsPage` | Patient appointment listing and consultation launcher |
| `/consultations/:appointmentId` | `ConsultationPage` | Simulated video feed, audio controls, and interactive chat |
| `/prescriptions/new` | `PrescriptionPage` | Prescription generation with restricted drug validation |
| `/prescriptions/view/:id` | `PrescriptionPage` | Printable prescription preview and print dialog |
| `/patient-dashboard` | `PatientDashboardPage` | Patient portal with upcoming and past appointments |
| `/doctor-register` | `DoctorRegistrationPage` | Clinician registration and license document upload |
| `/doctor-dashboard` | `DoctorDashboardPage` | Doctor portal with schedule, consultation access, and online toggle |
| `/admin/verification` | `AdminVerificationPage` | Medical board admin interface for approving doctor applications |
| `/login` | `LoginPage` | Role switcher and demo login portal |
| `/register` | `RegisterPage` | Patient account registration |

---

## 📋 Demonstration Workflows

### Workflow A: Patient Discovers and Books a Doctor
1. Open Home (`/`) and click **"Find a Doctor"**.
2. Filter by specialty (e.g., *Cardiology*) or search by name.
3. Click **"View Profile"** on **Dr. Sarah Mitchell**.
4. Choose an appointment date and time slot, then click **"Proceed to Confirm Booking"**.
5. Review appointment details and click **"Confirm Appointment"**.
6. View the persistent booking in **"My Appointments"** (`/appointments`).

### Workflow B: Symptom Assessment & Emergency Red-Flag Intercept
1. Navigate to **"Symptom Checker"** (`/symptoms`).
2. **Emergency Demonstration:** Click *"Crushing or radiating chest pain"*. Notice that the system halts standard triage and displays an emergency banner advising immediate 911 contact.
3. Click **"Reset Symptom Checker"**.
4. Select *"Fever or Chills"* and *"Persistent Cough"*, set duration/severity, and click **"Submit Symptoms for Assessment"**.
5. Observe the simulated decision-support recommendation and matched specialists.

### Workflow C: Doctor Onboarding & Admin Board Approval
1. Navigate to **"Doctor Onboarding"** (`/doctor-register`).
2. Complete the form (e.g., *"Dr. Robert King"*, *Cardiology*, experience, fee) and submit.
3. Observe the confirmation stating status is **PENDING ADMIN BOARD APPROVAL**.
4. Navigate to **"Medical Board Verification"** (`/admin/verification`).
5. Locate Dr. Robert King under the *Pending Review* tab and click **"Approve"**.
6. Open **"Find Doctors"** (`/doctors`) to verify Dr. Robert King now appears in patient discovery.

### Workflow D: Virtual Consultation & Prescription Compliance
1. From `/appointments`, click **"Join Consultation Room"**.
2. Test video controls (mic mute, camera toggle, screen share) and send a chat message; observe the automated doctor reply.
3. Click **"Clinical Prescription Generator"**.
4. **Compliance Demonstration:** Click *"Test: Morphine (Schedule II Narcotic)"*. Note the red compliance warning and blocked submission button.
5. Click **"Remove"** on the restricted substance.
6. Click **"Generate Compliant e-Prescription"** to view and print the final clinical prescription.

---

## ⚠️ Academic & Scope Notice

This project is a **frontend-only educational prototype** developed for a college mini project review.
- No real medical advice, clinical diagnosis, or live prescribing is provided.
- Real WebRTC/streaming, payment gateways, pharmacy fulfillment, and external authentication services are intentionally omitted in favor of simulated client workflows and mock REST API persistence via JSON Server.
