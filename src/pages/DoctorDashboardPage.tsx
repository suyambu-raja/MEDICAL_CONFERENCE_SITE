import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Power, 
  FileText, 
  User, 
  Activity, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { Doctor } from '../types/doctor';
import { Appointment } from '../types/appointment';
import { VerificationBadge, AvailabilityBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const DoctorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoctorData = async () => {
    try {
      setLoading(true);
      // Retrieve doctor record for demo account (default: doc-1 Sarah Mitchell)
      const targetDocId = user?.doctorId || 'doc-1';
      let docData: Doctor;

      try {
        docData = await doctorService.getDoctorById(targetDocId);
      } catch {
        const all = await doctorService.getAllDoctors();
        docData = all[0];
      }

      setDoctor(docData);

      // Load appointments for this doctor or all appointments
      const allApts = await appointmentService.getAppointments();
      const docApts = allApts.filter(a => a.doctorId === docData.id || a.doctorName.includes(docData.name));
      setAppointments(docApts.length > 0 ? docApts : allApts);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error loading doctor dashboard';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!doctor) return;
    try {
      setIsTogglingAvailability(true);
      const newStatus = !doctor.isAvailable;
      const updated = await doctorService.toggleDoctorAvailability(doctor.id, newStatus);
      setDoctor(updated);
    } catch (err) {
      console.error('Failed to toggle availability:', err);
      alert('Failed to update availability status on JSON Server.');
    } finally {
      setIsTogglingAvailability(false);
    }
  };

  if (loading) {
    return (
      <div className="container page-container">
        <LoadingSpinner message="Loading clinician clinical portal..." />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h2>Doctor Dashboard Unavailable</h2>
        <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>{error}</p>
        <button onClick={loadDoctorData} className="btn btn-primary">
          <RefreshCw size={15} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container page-container">
      {/* Header Profile Ribbon */}
      <div className="card" style={{
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        borderTop: '4px solid var(--teal-600)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: 'var(--radius-lg)',
              objectFit: 'cover',
              border: '2px solid var(--slate-200)'
            }}
          />

          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--navy-900)' }}>
                {doctor.name}
              </h1>
              <VerificationBadge status={doctor.verificationStatus} />
              <AvailabilityBadge isAvailable={doctor.isAvailable} />
            </div>

            <div style={{ color: 'var(--teal-700)', fontWeight: 600, fontSize: '0.95rem' }}>
              {doctor.specialty} • {doctor.qualifications}
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
              Clinic: {doctor.clinicAddress} ({doctor.location})
            </div>
          </div>
        </div>

        {/* Action: Availability Toggle (PATCH to JSON Server) */}
        <div style={{
          backgroundColor: 'var(--slate-50)',
          border: '1px solid var(--slate-200)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Live Teleconsultation Status
          </span>
          <button
            onClick={handleToggleAvailability}
            disabled={isTogglingAvailability}
            className={`btn btn-sm ${doctor.isAvailable ? 'btn-secondary' : 'btn-outline'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Power size={14} />
            {isTogglingAvailability
              ? 'Saving to API...'
              : doctor.isAvailable
              ? 'Status: ONLINE (Click to Go Offline)'
              : 'Status: OFFLINE (Click to Go Online)'}
          </button>
        </div>
      </div>

      {/* Main Grid: Schedule and Quick Tools */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Scheduled Appointments */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', margin: 0 }}>
                Patient Appointment Schedule
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Active bookings retrieved from JSON Server database
              </span>
            </div>
            <button onClick={loadDoctorData} className="btn btn-outline btn-sm">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
              No appointments currently scheduled for your profile.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {appointments.map(apt => (
                <div
                  key={apt.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    borderLeft: '4px solid var(--primary-600)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                        #{apt.id}
                      </span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--navy-900)' }}>
                        {apt.patientName}
                      </strong>
                    </div>
                    <span className="badge badge-approved" style={{ textTransform: 'capitalize' }}>
                      {apt.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} color="var(--primary-600)" />
                      {apt.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Clock size={14} color="var(--teal-600)" />
                      {apt.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Video size={14} color="var(--slate-500)" />
                      Teleconsultation Session
                    </span>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--slate-50)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    color: 'var(--slate-600)'
                  }}>
                    <strong>Reported Symptoms / Reason:</strong> {apt.reason}
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
                    <button
                      onClick={() => navigate(`/consultations/${apt.id}`)}
                      className="btn btn-primary btn-sm"
                    >
                      <Video size={14} /> Open Consultation
                    </button>
                    <button
                      onClick={() => navigate(`/prescriptions/new?appointmentId=${apt.id}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      <FileText size={14} /> Generate Rx
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Practice Quick Stats & Slots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Metrics */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
              Consultation Metrics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-100)' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>Total Consultations</span>
                <strong style={{ color: 'var(--navy-900)' }}>{appointments.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-100)' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>Patient Rating</span>
                <strong style={{ color: '#f59e0b' }}>★ {doctor.rating} / 5.0</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>Per Session Fee</span>
                <strong style={{ color: 'var(--teal-700)' }}>${doctor.consultationFee}</strong>
              </div>
            </div>
          </div>

          {/* Published Slot Windows */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--navy-900)' }}>
              Published Appointment Slots
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {doctor.availableSlots?.map(slot => (
                <div key={slot.date} style={{ backgroundColor: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
                    📅 {slot.date}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {slot.timeSlots.map(t => (
                      <span key={t} style={{
                        backgroundColor: 'white',
                        border: '1px solid var(--slate-200)',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '3px',
                        fontSize: '0.75rem',
                        color: 'var(--slate-600)'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
