import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Stethoscope, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Video, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Clock, 
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { Doctor } from '../types/doctor';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const SPECIALTIES = [
  { name: 'Cardiology', icon: '❤️', description: 'Hypertension, chest pain & heart health' },
  { name: 'Dermatology', icon: '✨', description: 'Skin conditions, rashes & allergies' },
  { name: 'Neurology', icon: '🧠', description: 'Headaches, migraines & neuropathic care' },
  { name: 'General Medicine', icon: '🩺', description: 'Viral illness, wellness & primary care' },
  { name: 'Pediatrics', icon: '👶', description: 'Childhood health & seasonal ailments' },
  { name: 'Orthopedics', icon: '🦴', description: 'Joint pain, sprains & sports injuries' },
  { name: 'ENT (Otolaryngology)', icon: '👂', description: 'Sinus, ear congestion & throat care' },
  { name: 'Psychiatry', icon: '🌱', description: 'Stress management & mental wellness' },
];

export const HomePage: React.FC = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function loadFeaturedDoctors() {
      try {
        setLoading(true);
        const docs = await doctorService.getDoctors();
        if (mounted) {
          // Display top 3 approved doctors on the home page
          setFeaturedDoctors(docs.slice(0, 3));
          setError(null);
        }
      } catch (err: unknown) {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Unable to connect to mock API server';
          setError(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadFeaturedDoctors();
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem', paddingBottom: '3rem' }}>
      {/* 1. Hero Section */}
      <section style={{
        background: 'linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdfa 100%)',
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '1px solid var(--slate-200)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Left Text & Actions */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid var(--primary-200)',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 0.95rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--primary-700)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '1.25rem'
            }}>
              <Sparkles size={16} color="var(--primary-600)" />
              Next-Gen Medical Teleconsultation
            </div>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              color: 'var(--navy-900)',
              lineHeight: 1.18,
              marginBottom: '1.25rem',
              fontWeight: 800
            }}>
              Find the Right Doctor.{' '}
              <span style={{
                background: 'linear-gradient(135deg, var(--primary-600), var(--teal-600))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Get Care with Confidence.
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'var(--slate-600)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '560px'
            }}>
              Discover available doctors, understand your symptoms, and connect with healthcare professionals through one convenient platform.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <Link to="/doctors" className="btn btn-primary btn-lg">
                <Stethoscope size={18} /> Find a Doctor
              </Link>
              <Link to="/symptoms" className="btn btn-secondary btn-lg">
                <Activity size={18} /> Check Symptoms
              </Link>
            </div>

            {/* Trust highlights */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.75rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(14, 165, 233, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={20} color="var(--teal-600)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy-800)' }}>
                  Verified Clinicians
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} color="var(--primary-600)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy-800)' }}>
                  Instant Virtual Slots
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={20} color="#6366f1" />
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy-800)' }}>
                  Interactive Teleconsult
                </span>
              </div>
            </div>
          </div>

          {/* Right Image / Hero Visual */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 25px 45px -12px rgba(2, 132, 199, 0.25)',
              border: '4px solid white'
            }}>
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800"
                alt="Doctor Teleconsultation in Progress"
                style={{ width: '100%', height: '420px', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 100%)',
                padding: '1.5rem',
                color: 'white'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Live Consultation
                  </span>
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                  Dr. Sarah Mitchell & Dr. Marcus Vance active today
                </div>
              </div>
            </div>

            {/* Floating Card: Fast Booking */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '-20px',
              backgroundColor: 'white',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid var(--slate-100)'
            }}>
              <div style={{
                backgroundColor: 'var(--teal-50)',
                color: 'var(--teal-600)',
                padding: '0.5rem',
                borderRadius: '8px'
              }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy-900)' }}>100% Mock REST API</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Powered by JSON Server</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How MedConnect Works */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            color: 'var(--primary-600)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Seamless Patient Journey
          </span>
          <h2 style={{ fontSize: '2.1rem', marginTop: '0.35rem', marginBottom: '0.75rem' }}>
            How MedConnect Works
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem', color: 'var(--slate-500)' }}>
            Experience an end-to-end healthcare workflow designed for college demonstration and review.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          position: 'relative'
        }}>
          {[
            { step: '01', title: 'Enter Symptoms', desc: 'Select symptoms, duration, and severity in the interactive symptom checker.' },
            { step: '02', title: 'Review Output', desc: 'Receive rules-based clinical triage guidance and specialty suggestions.' },
            { step: '03', title: 'Discover Doctors', desc: 'Browse verified, credentialed specialists matching your health condition.' },
            { step: '04', title: 'Book Slot', desc: 'Pick an available time slot and confirm your booking instantly via mock API.' },
            { step: '05', title: 'Attend Consult', desc: 'Enter the teleconsultation room, chat with your doctor, and receive a prescription.' }
          ].map((item, idx) => (
            <div
              key={item.step}
              className="card"
              style={{
                position: 'relative',
                padding: '1.5rem',
                borderTop: '4px solid var(--primary-600)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--primary-200)',
                fontFamily: 'var(--font-heading)',
                marginBottom: '0.5rem'
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.45rem', color: 'var(--navy-900)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Doctor Discovery Section */}
      <section className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <span style={{
              color: 'var(--teal-600)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              Certified Medical Practitioners
            </span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '0.35rem', marginBottom: '0.35rem' }}>
              Featured Available Doctors
            </h2>
            <p style={{ color: 'var(--slate-500)', margin: 0 }}>
              Board-verified specialists ready for immediate virtual consultation.
            </p>
          </div>

          <Link to="/doctors" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Browse All Doctors <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching doctors from JSON Server..." />
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', border: '1px dashed #ef4444' }}>
            <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Make sure JSON Server is running locally with <code>npm run dev:api</code>.
            </p>
          </div>
        ) : (
          <div className="grid-3">
            {featuredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Specialties Section */}
      <section style={{ backgroundColor: 'var(--slate-50)', padding: '4rem 0', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              color: 'var(--primary-600)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              Clinical Disciplines
            </span>
            <h2 style={{ fontSize: '2.1rem', marginTop: '0.35rem', marginBottom: '0.5rem' }}>
              Explore Medical Specialties
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--slate-500)' }}>
              Consult with board-certified physicians across major outpatient medical fields.
            </p>
          </div>

          <div className="grid-4">
            {SPECIALTIES.map(item => (
              <div
                key={item.name}
                onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(item.name)}`)}
                className="card card-hover"
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  padding: '1.5rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '0.75rem',
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--slate-200)'
                }}>
                  {item.icon}
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
                  {item.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-500)', lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Additional Landing Page Content & Final Call-To-Action */}
      <section className="container">
        <div style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0d9488 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2.5rem',
          color: 'white',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <h2 style={{ color: 'white', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1rem', maxWidth: '700px' }}>
            Ready to Connect with a Trusted Doctor?
          </h2>
          <p style={{ color: '#e0f2fe', fontSize: '1.1rem', maxWidth: '620px', lineHeight: 1.6, marginBottom: '2rem' }}>
            Start with our intelligent symptom checker or book directly with certified doctors. Built for seamless demonstration and evaluation.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link
              to="/doctors"
              className="btn"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary-700)',
                padding: '0.85rem 2rem',
                fontSize: '1rem',
                fontWeight: 700
              }}
            >
              Book Consultation Now
            </Link>
            <Link
              to="/symptoms"
              className="btn btn-outline"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                color: 'white',
                padding: '0.85rem 2rem',
                fontSize: '1rem'
              }}
            >
              Launch Symptom Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
