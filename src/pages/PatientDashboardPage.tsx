import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User as UserIcon, 
  Calendar, 
  Activity, 
  Stethoscope, 
  Clock, 
  Video, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types/appointment';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export const PatientDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await appointmentService.getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error('Error loading patient dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="container page-container">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0d9488 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        color: 'white',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '2.5rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '0.25rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.75rem'
          }}>
            <ShieldCheck size={14} /> Verified Patient Account
          </div>
          <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.4rem' }}>
            Welcome back, {user?.name || 'Alex Johnson'}!
          </h1>
          <p style={{ color: '#e0f2fe', fontSize: '1rem', maxWidth: '580px', margin: 0 }}>
            Track your scheduled teleconsultations, explore certified doctors, or review symptoms before your appointment.
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Link
            to="/doctors"
            className="btn"
            style={{
              backgroundColor: 'white',
              color: 'var(--primary-700)',
              fontWeight: 700
            }}
          >
            <Stethoscope size={16} /> Find Doctors
          </Link>
          <Link
            to="/symptoms"
            className="btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              fontWeight: 600
            }}
          >
            <Activity size={16} /> Check Symptoms
          </Link>
        </div>
      </div>

      {/* Main Sections */}
      {loading ? (
        <LoadingSpinner message="Loading patient health dashboard from JSON Server..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Upcoming Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', margin: 0 }}>
                  Upcoming Consultations ({upcomingAppointments.length})
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  Confirmed slots ready for virtual teleconsultation
                </span>
              </div>
              <Link to="/appointments" className="btn btn-outline btn-sm">
                View All
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--slate-500)' }}>
                <Calendar size={32} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
                <h4 style={{ color: 'var(--navy-800)', marginBottom: '0.25rem' }}>No upcoming appointments</h4>
                <p style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                  Search verified specialists and choose an appointment slot that fits your schedule.
                </p>
                <Link to="/doctors" className="btn btn-primary btn-sm">
                  Schedule Consultation
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {upcomingAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Completed Consultations */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', margin: 0 }}>
                Recent Consultation History
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Past sessions with clinical notes and generated prescriptions
              </span>
            </div>

            {pastAppointments.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                No completed consultations recorded yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                {pastAppointments.map(apt => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
