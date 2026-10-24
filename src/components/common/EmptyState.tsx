import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="state-container" style={{ margin: '2rem 0' }}>
      <div style={{
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        backgroundColor: 'var(--slate-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--slate-400)',
        marginBottom: '1rem'
      }}>
        {icon || <AlertCircle size={28} />}
      </div>
      <h3 style={{ color: 'var(--navy-900)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
        {title}
      </h3>
      <p style={{ maxWidth: '440px', fontSize: '0.92rem', color: 'var(--slate-500)', marginBottom: actionText ? '1.5rem' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-outline btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
