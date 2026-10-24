import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  FileText, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { Doctor } from '../types/doctor';
import { Appointment } from '../types/appointment';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialDate = searchParams.get('date') || '';
  const initialSlot = searchParams.get('slot') || '';

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedSlot, setSelectedSlot] = useState<string>(initialSlot);
  const [reason, setReason] = useState('Routine teleconsultation & health review');
  const [patientName, setPatientName] = useState(user?.name || 'Alex Johnson');
  const [consultationType, setConsultationType] = useState<'video' | 'chat'>('video');

  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoctor() {
      if (!doctorId) {
        // Fallback to first doctor if no doctorId in URL
        try {
          const docs = await doctorService.getDoctors();
          if (docs.length > 0) {
            setDoctor(docs[0]);
            initSlots(docs[0]);
          }
        } catch {
          setError('Could not load doctor details.');
        } finally {
          setLoadingDoctor(false);
        }
        return;
      }

      try {
        setLoadingDoctor(true);
        const doc = await doctorService.getDoctorById(doctorId);
        setDoctor(doc);
        initSlots(doc);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Doctor not found';
        setError(msg);
      } finally {
        setLoadingDoctor(false);
      }
    }

    function initSlots(doc: Doctor) {
      if (!initialDate && doc.availableSlots && doc.availableSlots.length > 0) {
        setSelectedDate(doc.availableSlots[0].date);
        if (!initialSlot && doc.availableSlots[0].timeSlots.length > 0) {
          setSelectedSlot(doc.availableSlots[0].timeSlots[0]);
        }
      }
    }

    loadDoctor();
  }, [doctorId]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    if (!selectedDate || !selectedSlot) {
      alert('Please select an available appointment date and time slot.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const created = await appointmentService.createAppointment({
        patientId: user?.patientId || 'pat-1',
        patientName: patientName.trim() || 'Alex Johnson',
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorAvatar: doctor.avatarUrl,
        date: selectedDate,
        time: selectedSlot,
        reason: reason.trim(),
        fee: doctor.consultationFee,
        consultationType,
      });

      setConfirmedAppointment(created);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to book appointment';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="container page-container">
        <LoadingSpinner message="Preparing appointment scheduling console..." />
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h2>Unable to Load Appointment Booking</h2>
        <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Doctors
        </Link>
      </div>
    );
  }

  // Success Confirmation Screen
  if (confirmedAppointment && doctor) {
    return (
      <div className="container page-container" style={{ maxWidth: '680px' }}>
        <div className="card" style={{
          textAlign: 'center',
          padding: '2.5rem',
          borderTop: '5px solid #10b981',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ color: 'var(--navy-900)', marginBottom: '0.5rem' }}>
            Appointment Confirmed!
          </h2>
          <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
            Your teleconsultation has been successfully scheduled and persisted to JSON Server.
          </p>

          {/* Details breakdown */}
          <div style={{
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--slate-500)' }}>Appointment ID</span>
              <strong style={{ color: 'var(--navy-900)' }}>#{confirmedAppointment.id}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--slate-500)' }}>Doctor</span>
              <strong style={{ color: 'var(--navy-900)' }}>{confirmedAppointment.doctorName} ({confirmedAppointment.doctorSpecialty})</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--slate-500)' }}>Date & Time</span>
              <strong style={{ color: 'var(--primary-700)' }}>{confirmedAppointment.date} at {confirmedAppointment.time}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-200)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--slate-500)' }}>Patient</span>
              <strong style={{ color: 'var(--navy-900)' }}>{confirmedAppointment.patientName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--slate-500)' }}>Status</span>
              <span className="badge badge-approved" style={{ textTransform: 'capitalize' }}>
                {confirmedAppointment.status}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/appointments" className="btn btn-primary">
              View in My Appointments
            </Link>
            <Link to={`/consultations/${confirmedAppointment.id}`} className="btn btn-secondary">
              Open Consultation Room
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentDateSlots = doctor?.availableSlots?.find(s => s.date === selectedDate)?.timeSlots || [];

  return (
    <div className="container page-container" style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Book Teleconsultation Appointment</h1>
        <p className="page-subtitle">
          Confirm your virtual appointment slot with {doctor?.name}.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #f87171',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          color: '#991b1b',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {doctor && (
        <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Selected Doctor Summary Card */}
          <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: '#f0f9ff', borderColor: 'var(--primary-200)' }}>
            <img
              src={doctor.avatarUrl}
              alt={doctor.name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--navy-900)' }}>
                  {doctor.name}
                </h3>
                <span className="badge badge-approved" style={{ fontSize: '0.72rem' }}>Verified</span>
              </div>
              <div style={{ color: 'var(--primary-700)', fontWeight: 600, fontSize: '0.88rem' }}>
                {doctor.specialty} • {doctor.qualifications}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                Consultation Fee: <strong>${doctor.consultationFee}</strong> per session
              </div>
            </div>
          </div>

          {/* Date & Time Slot Selection */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
              1. Choose Date and Time
            </h3>

            {/* Dates */}
            <div className="form-group">
              <label className="form-label">Available Dates</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {doctor.availableSlots?.map(slotObj => {
                  const isSelected = selectedDate === slotObj.date;
                  return (
                    <button
                      key={slotObj.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(slotObj.date);
                        if (slotObj.timeSlots.length > 0) setSelectedSlot(slotObj.timeSlots[0]);
                      }}
                      style={{
                        padding: '0.65rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                        backgroundColor: isSelected ? 'var(--primary-50)' : 'white',
                        color: isSelected ? 'var(--primary-700)' : 'var(--navy-800)',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.88rem'
                      }}
                    >
                      📅 {slotObj.date}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div className="form-group">
              <label className="form-label">Available Slots</label>
              {currentDateSlots.length === 0 ? (
                <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>
                  No open slots for this date.
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '0.5rem' }}>
                  {currentDateSlots.map(timeStr => {
                    const isSelected = selectedSlot === timeStr;
                    return (
                      <button
                        key={timeStr}
                        type="button"
                        onClick={() => setSelectedSlot(timeStr)}
                        style={{
                          padding: '0.6rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '2px solid var(--teal-600)' : '1px solid var(--slate-200)',
                          backgroundColor: isSelected ? 'var(--teal-50)' : 'white',
                          color: isSelected ? 'var(--teal-700)' : 'var(--navy-800)',
                          fontWeight: isSelected ? 700 : 500,
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          textAlign: 'center'
                        }}
                      >
                        ⏱ {timeStr}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Patient Details & Objective */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
              2. Patient Information & Consultation Reason
            </h3>

            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                className="form-control"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reason for Consultation / Symptoms Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Briefly state your primary symptoms or questions for the doctor..."
                required
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting || !selectedDate || !selectedSlot}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Confirming Appointment via REST API...' : 'Confirm Appointment'}
          </button>
        </form>
      )}
    </div>
  );
};
