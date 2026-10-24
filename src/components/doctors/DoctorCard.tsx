import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase, Award, Calendar, Video } from 'lucide-react';
import { Doctor } from '../../types/doctor';
import { VerificationBadge, AvailabilityBadge } from '../common/Badge';

interface DoctorCardProps {
  doctor: Doctor;
  showActions?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, showActions = true }) => {
  const navigate = useNavigate();

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header: Image, Badges, Name */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={doctor.avatarUrl}
            alt={doctor.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: 'var(--radius-md)',
              objectFit: 'cover',
              border: '2px solid var(--slate-100)',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            background: doctor.isAvailable ? '#10b981' : '#94a3b8',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: '2px solid white'
          }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <VerificationBadge status={doctor.verificationStatus} />
          </div>

          <h3 style={{
            fontSize: '1.15rem',
            marginBottom: '0.2rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <Link to={`/doctors/${doctor.id}`} style={{ color: 'var(--navy-900)' }}>
              {doctor.name}
            </Link>
          </h3>

          <div style={{
            color: 'var(--primary-600)',
            fontWeight: 700,
            fontSize: '0.88rem',
            marginBottom: '0.25rem'
          }}>
            {doctor.specialty}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--slate-500)' }}>
            <Award size={14} color="var(--slate-400)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {doctor.qualifications}
            </span>
          </div>
        </div>
      </div>

      {/* Meta tags / Quick Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.6rem',
        padding: '0.75rem',
        backgroundColor: 'var(--slate-50)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '1rem',
        fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)' }}>
          <Briefcase size={14} color="var(--primary-600)" />
          <span>{doctor.experienceYears} Years Exp.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)' }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span><strong>{doctor.rating}</strong> ({doctor.reviewCount})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)', gridColumn: 'span 2' }}>
          <MapPin size={14} color="var(--teal-600)" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doctor.location}
          </span>
        </div>
      </div>

      {/* Bio excerpt */}
      <p style={{
        fontSize: '0.85rem',
        color: 'var(--slate-500)',
        lineHeight: 1.45,
        marginBottom: '1rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {doctor.bio}
      </p>

      {/* Pricing & Availability footer */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--slate-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: showActions ? '1rem' : 0
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'block' }}>Consultation Fee</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)' }}>
            ${doctor.consultationFee}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}> / session</span>
        </div>
        <div>
          <AvailabilityBadge isAvailable={doctor.isAvailable} />
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <Link
            to={`/doctors/${doctor.id}`}
            className="btn btn-outline btn-sm"
            style={{ width: '100%' }}
          >
            View Profile
          </Link>
          <button
            onClick={() => navigate(`/book/${doctor.id}`)}
            className="btn btn-primary btn-sm"
            style={{ width: '100%' }}
          >
            <Calendar size={14} /> Book Now
          </button>
        </div>
      )}
    </div>
  );
};
