import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container page-container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-100)',
        color: 'var(--primary-600)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem'
      }}>
        <HeartPulse size={36} />
      </div>

      <h1 style={{ fontSize: '3.5rem', color: 'var(--navy-900)', marginBottom: '0.5rem', fontWeight: 800 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-800)', marginBottom: '1rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--slate-500)', maxWidth: '440px', margin: '0 auto 2rem' }}>
        The healthcare service or teleconsultation page you are looking for does not exist or has been relocated.
      </p>

      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Home
      </Link>
    </div>
  );
};
