import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldAlert, FileText, Lock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      borderTop: '1px solid #1e293b',
      paddingTop: '3.5rem',
      paddingBottom: '2.5rem',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0284c7, #0d9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <HeartPulse size={20} strokeWidth={2.5} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#ffffff'
              }}>
                Med<span style={{ color: '#2dd4bf' }}>Connect</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              A modern medical teleconsultation platform prototype designed for seamless patient discovery, clinical symptom triage support, virtual consultations, and verified doctor onboarding.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#64748b', fontSize: '0.8rem' }}>
              <Award size={16} color="#38bdf8" />
              <span>College Mini Project Review Prototype</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 600 }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li>
                <Link to="/" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Home Overview</Link>
              </li>
              <li>
                <Link to="/doctors" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Find Approved Doctors</Link>
              </li>
              <li>
                <Link to="/symptoms" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Interactive Symptom Checker</Link>
              </li>
              <li>
                <Link to="/appointments" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>My Teleconsultation Bookings</Link>
              </li>
              <li>
                <Link to="/patient-dashboard" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Patient Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Professional & Admin Portals */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 600 }}>
              Clinician & Board Tools
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <li>
                <Link to="/doctor-register" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Doctor Onboarding Application</Link>
              </li>
              <li>
                <Link to="/doctor-dashboard" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Doctor Schedule & Console</Link>
              </li>
              <li>
                <Link to="/admin/verification" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Medical Board Verification</Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Role Switch & Login Portal</Link>
              </li>
            </ul>
          </div>

          {/* Demonstration Notice */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={18} color="#f59e0b" /> Academic Notice
            </h4>
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '0.82rem',
              color: '#94a3b8',
              lineHeight: 1.5
            }}>
              <p style={{ margin: 0, color: '#cbd5e1' }}>
                <strong>Educational Prototype:</strong> MedConnect is built for college evaluation with simulated data via local JSON Server.
              </p>
              <p style={{ marginTop: '0.5rem', marginBottom: 0, color: '#fca5a5' }}>
                If you are experiencing a real medical emergency, please dial 911 or visit your nearest emergency room immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} MedConnect Telehealth Systems. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} /> Mock REST API via JSON Server
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={14} /> Academic Mini Project Review
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
