import React from 'react';
import { CheckCircle2, Clock, XCircle, Activity } from 'lucide-react';
import { VerificationStatus } from '../../types/doctor';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  if (status === 'approved') {
    return (
      <span className="badge badge-approved" title="Verified and licensed medical practitioner">
        <CheckCircle2 size={13} strokeWidth={2.5} />
        <span>Verified Specialist</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className="badge badge-pending" title="Awaiting medical credentials verification">
        <Clock size={13} strokeWidth={2.5} />
        <span>Pending Review</span>
      </span>
    );
  }

  return (
    <span className="badge badge-rejected" title="Application rejected or credentials unconfirmed">
      <XCircle size={13} strokeWidth={2.5} />
      <span>Application Rejected</span>
    </span>
  );
};

interface AvailabilityBadgeProps {
  isAvailable: boolean;
}

export const AvailabilityBadge: React.FC<AvailabilityBadgeProps> = ({ isAvailable }) => {
  if (isAvailable) {
    return (
      <span className="badge badge-online">
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
        <span>Available for Consultation</span>
      </span>
    );
  }

  return (
    <span className="badge badge-offline">
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94a3b8' }} />
      <span>Currently Offline</span>
    </span>
  );
};

interface UrgencyBadgeProps {
  urgency: 'Low' | 'Low to Moderate' | 'Moderate' | 'High' | 'Emergency';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const getColor = () => {
    switch (urgency) {
      case 'Emergency': return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
      case 'High': return { bg: '#ffedd5', text: '#c2410c', border: '#fdba74' };
      case 'Moderate': return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      default: return { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' };
    }
  };

  const colors = getColor();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.2rem 0.6rem',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.78rem',
      fontWeight: 700,
      backgroundColor: colors.bg,
      color: colors.text,
      border: `1px solid ${colors.border}`
    }}>
      <Activity size={12} />
      <span>Urgency: {urgency}</span>
    </span>
  );
};
