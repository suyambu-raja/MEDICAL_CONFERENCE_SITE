import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { FindDoctorsPage } from './pages/FindDoctorsPage';
import { DoctorDetailsPage } from './pages/DoctorDetailsPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { BookingPage } from './pages/BookingPage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { PatientDashboardPage } from './pages/PatientDashboardPage';
import { DoctorRegistrationPage } from './pages/DoctorRegistrationPage';
import { DoctorDashboardPage } from './pages/DoctorDashboardPage';
import { PrescriptionPage } from './pages/PrescriptionPage';
import { AdminVerificationPage } from './pages/AdminVerificationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/doctors" element={<FindDoctorsPage />} />
              <Route path="/doctors/:id" element={<DoctorDetailsPage />} />
              <Route path="/symptoms" element={<SymptomCheckerPage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/book/:doctorId" element={<BookingPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/consultations" element={<ConsultationPage />} />
              <Route path="/consultations/:appointmentId" element={<ConsultationPage />} />
              <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
              <Route path="/doctor-register" element={<DoctorRegistrationPage />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
              <Route path="/prescriptions/new" element={<PrescriptionPage />} />
              <Route path="/prescriptions/view/:appointmentId" element={<PrescriptionPage />} />
              <Route path="/admin/verification" element={<AdminVerificationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
