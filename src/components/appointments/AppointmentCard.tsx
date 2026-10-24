import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Appointment } from '../../types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="badge badge-approved" style={{ fontSize: '0.8rem' }}>
            <CheckCircle2 size={13} /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
            <FileText size={13} /> Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="badge badge-online">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            In Progress
          </span>
        );
      default:
        return (
          <span className="badge badge-rejected">
            <AlertCircle size={13} /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--primary-600)' }}>
      {/* Top Bar: ID and Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Appointment #{appointment.id}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', background: 'var(--slate-100)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
            Fee: ${appointment.fee}
          </span>
        </div>
        <div>{getStatusBadge(appointment.status)}</div>
      </div>

      {/* Main Section: Doctor Avatar, Name, Specialty, Schedule */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <img
          src={appointment.doctorAvatar}
          alt={appointment.doctorName}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-md)',
            objectFit: 'cover',
            border: '1px solid var(--slate-200)'
          }}
        />

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--navy-900)' }}>
            {appointment.doctorName}
          </h4>
          <div style={{ color: 'var(--primary-600)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
            {appointment.doctorSpecialty}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={15} color="var(--primary-600)" />
              <strong>{appointment.date}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={15} color="var(--teal-600)" />
              {appointment.time}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Video size={15} color="var(--slate-500)" />
              Teleconsultation
            </span>
          </div>
        </div>
      </div>

      {/* Patient Reason */}
      <div style={{
        backgroundColor: 'var(--slate-50)',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.86rem',
        color: 'var(--slate-600)'
      }}>
        <strong style={{ color: 'var(--navy-800)', display: 'block', marginBottom: '0.2rem' }}>
          Consultation Objective / Symptoms:
        </strong>
        {appointment.reason || 'General health evaluation.'}
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem', borderTop: '1px solid var(--slate-100)' }}>
        <button
          onClick={() => navigate(`/consultations/${appointment.id}`)}
          className="btn btn-primary btn-sm"
        >
          <Video size={15} /> Join Consultation Room
        </button>

        {appointment.status === 'completed' && (
          <button
            onClick={() => navigate(`/prescriptions/view/${appointment.id}`)}
            className="btn btn-outline btn-sm"
          >
            <FileText size={15} /> View Prescription
          </button>
        )}
      </div>
    </div>
  );
};
