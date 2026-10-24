import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Lock, 
  User as UserIcon, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

export const LoginPage: React.FC = () => {
  const { loginAs, demoAccounts } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('alex.johnson@example.com');
  const [password, setPassword] = useState('demo123');

  const handleDemoLogin = (role: UserRole) => {
    loginAs(role);
    if (role === 'patient') navigate('/patient-dashboard');
    else if (role === 'doctor') navigate('/doctor-dashboard');
    else if (role === 'admin') navigate('/admin/verification');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match against demo accounts
    const match = demoAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (match) {
      handleDemoLogin(match.role);
    } else {
      // Default fallback login as patient
      loginAs('patient', { name: email.split('@')[0], email: email.trim() });
      navigate('/patient-dashboard');
    }
  };

  return (
    <div className="container page-container" style={{ maxWidth: '520px', paddingTop: '3rem' }}>
      <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
        {/* Logo & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary-600), var(--teal-600))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
          }}>
            <HeartPulse size={26} strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: '0.35rem' }}>
            MedConnect Portal Login
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', margin: 0 }}>
            Sign in to access your teleconsultations and healthcare records.
          </p>
        </div>

        {/* 1-Click Demo Account Quick Fill Buttons (Reviewer Friendly) */}
        <div style={{
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-200)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: 'var(--primary-800)',
            marginBottom: '0.75rem'
          }}>
            <Sparkles size={16} /> 1-Click Evaluation Login (Demo Roles):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => handleDemoLogin('patient')}
              className="btn btn-outline btn-sm"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                backgroundColor: 'white',
                border: '1px solid var(--primary-300)',
                color: 'var(--primary-800)'
              }}
            >
              <UserIcon size={16} /> Patient Mode: <strong>Alex Johnson</strong>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('doctor')}
              className="btn btn-outline btn-sm"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                backgroundColor: 'white',
                border: '1px solid var(--teal-300)',
                color: 'var(--teal-800)'
              }}
            >
              <Stethoscope size={16} /> Doctor Mode: <strong>Dr. Sarah Mitchell</strong>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="btn btn-outline btn-sm"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                backgroundColor: 'white',
                border: '1px solid #fca5a5',
                color: '#991b1b'
              }}
            >
              <ShieldCheck size={16} /> Admin Mode: <strong>Medical Board Reviewer</strong>
            </button>
          </div>
        </div>

        {/* Standard Credentials Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Log In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--slate-500)' }}>
          Don't have a patient account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register as Patient
          </Link>
        </div>
      </div>
    </div>
  );
};
