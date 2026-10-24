import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Star, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Award, 
  Globe, 
  Mail, 
  Phone,
  ShieldCheck
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types/doctor';
import { VerificationBadge, AvailabilityBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const DoctorDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    async function fetchDoctor() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
        if (data.availableSlots && data.availableSlots.length > 0) {
          setSelectedDate(data.availableSlots[0].date);
          if (data.availableSlots[0].timeSlots.length > 0) {
            setSelectedSlot(data.availableSlots[0].timeSlots[0]);
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Doctor details could not be found';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="container page-container">
        <LoadingSpinner message="Retrieving doctor clinical profile..." />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Doctor Profile Not Found</h2>
        <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
          {error || 'The requested doctor profile does not exist or may have been unlisted.'}
        </p>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Doctor Directory
        </Link>
      </div>
    );
  }

  const currentDateSlots = doctor.availableSlots?.find(s => s.date === selectedDate)?.timeSlots || [];

  const handleProceedToBooking = () => {
    navigate(`/book/${doctor.id}?date=${encodeURIComponent(selectedDate)}&slot=${encodeURIComponent(selectedSlot)}`);
  };

  return (
    <div className="container page-container">
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate('/doctors')}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} /> Back to Doctor Directory
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Doctor Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid var(--slate-100)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />

              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <VerificationBadge status={doctor.verificationStatus} />
                  <AvailabilityBadge isAvailable={doctor.isAvailable} />
                </div>

                <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--navy-900)' }}>
                  {doctor.name}
                </h1>

                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-600)', marginBottom: '0.4rem' }}>
                  {doctor.specialty}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
                  <Award size={16} color="var(--primary-600)" />
                  <span>{doctor.qualifications}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Briefcase size={15} color="var(--teal-600)" />
                    <strong>{doctor.experienceYears} Years</strong> Experience
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Star size={15} color="#f59e0b" fill="#f59e0b" />
                    <strong>{doctor.rating}</strong> ({doctor.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* About / Clinical Bio */}
            <div style={{ marginBottom: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--slate-100)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--navy-900)' }}>
                About the Specialist
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                {doctor.bio}
              </p>
            </div>

            {/* Practice Details & Languages */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              backgroundColor: 'var(--slate-50)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Clinic Location
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--navy-800)', marginTop: '0.2rem' }}>
                  <MapPin size={15} color="var(--primary-600)" />
                  <span>{doctor.location}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
                  {doctor.clinicAddress}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Languages Spoken
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--navy-800)', marginTop: '0.2rem' }}>
                  <Globe size={15} color="var(--teal-600)" />
                  <span>{doctor.languages?.join(', ') || 'English'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Appointment Booking Card */}
        <div className="card" style={{ borderTop: '4px solid var(--primary-600)', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'block' }}>Consultation Fee</span>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)' }}>
                ${doctor.consultationFee}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}> / video session</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--teal-700)', fontSize: '0.85rem', fontWeight: 600 }}>
                <Video size={16} /> Virtual Telehealth
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Duration: 25 mins</span>
            </div>
          </div>

          {/* Date Selector */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={15} color="var(--primary-600)" />
              1. Select Appointment Date
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
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
                      padding: '0.65rem 0.5rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--primary-600)' : '1px solid var(--slate-200)',
                      backgroundColor: isSelected ? 'var(--primary-50)' : 'white',
                      color: isSelected ? 'var(--primary-700)' : 'var(--navy-800)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textAlign: 'center'
                    }}
                  >
                    {slotObj.date}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slot Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={15} color="var(--teal-600)" />
              2. Select Available Time Slot
            </label>
            {currentDateSlots.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                No slots open for selected date.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {currentDateSlots.map(timeStr => {
                  const isSelected = selectedSlot === timeStr;
                  return (
                    <button
                      key={timeStr}
                      type="button"
                      onClick={() => setSelectedSlot(timeStr)}
                      style={{
                        padding: '0.55rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '2px solid var(--teal-600)' : '1px solid var(--slate-200)',
                        backgroundColor: isSelected ? 'var(--teal-50)' : 'white',
                        color: isSelected ? 'var(--teal-700)' : 'var(--navy-800)',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Clock size={12} /> {timeStr}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Book Action */}
          <button
            onClick={handleProceedToBooking}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={!selectedDate || !selectedSlot}
          >
            <Calendar size={18} /> Proceed to Confirm Booking
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--slate-400)' }}>
            Instant confirmation saved to mock REST database.
          </div>
        </div>
      </div>
    </div>
  );
};
