import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types/appointment';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'completed'>('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadAppointments = async () => {
    try {
      setLoading(true);
      // For demonstration, retrieve all appointments or patient's appointments
      const data = await appointmentService.getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch appointments from JSON Server';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'all') return true;
    return apt.status === activeTab;
  });

  return (
    <div className="container page-container">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">
            Manage your scheduled teleconsultations, join active rooms, and view clinical records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadAppointments}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            title="Refresh appointments"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <Link to="/doctors" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Book New Appointment
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--slate-200)',
        marginBottom: '1.75rem'
      }}>
        {[
          { key: 'all', label: `All Bookings (${appointments.length})` },
          { key: 'confirmed', label: `Confirmed (${appointments.filter(a => a.status === 'confirmed').length})` },
          { key: 'completed', label: `Completed (${appointments.filter(a => a.status === 'completed').length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'all' | 'confirmed' | 'completed')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: activeTab === tab.key ? 'var(--primary-600)' : 'var(--slate-500)',
              borderBottom: activeTab === tab.key ? '2px solid var(--primary-600)' : '2px solid transparent',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Retrieving appointments from JSON Server..." />
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #ef4444' }}>
          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Failed to Load Appointments</h3>
          <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={loadAppointments} className="btn btn-outline btn-sm">
            Retry
          </button>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          title="No Appointments Found"
          description={
            activeTab === 'all'
              ? 'You do not have any scheduled teleconsultations yet. Discover available doctors and book your first session.'
              : `You have no ${activeTab} appointments.`
          }
          actionText="Find and Book a Doctor"
          onAction={() => navigate('/doctors')}
          icon={<Calendar size={30} />}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredAppointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}
    </div>
  );
};
