import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  subMessage?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Retrieving healthcare data from JSON Server...', 
  subMessage = 'Please wait while records load' 
}) => {
  return (
    <div className="state-container" style={{ margin: '2rem 0' }}>
      <div className="spinner" />
      <h4 style={{ color: 'var(--navy-900)', marginBottom: '0.35rem' }}>{message}</h4>
      <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)', margin: 0 }}>{subMessage}</p>
    </div>
  );
};
