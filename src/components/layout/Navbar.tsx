import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Menu, 
  X, 
  User as UserIcon, 
  ShieldCheck, 
  Stethoscope, 
  Calendar, 
  Activity, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const { user, isAuthenticated, role, loginAs, logout, demoAccounts } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole: UserRole) => {
    loginAs(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'patient') navigate('/patient-dashboard');
    else if (newRole === 'doctor') navigate('/doctor-dashboard');
    else if (newRole === 'admin') navigate('/admin/verification');
  };

  const handleLogout = () => {
    logout();
    setRoleDropdownOpen(false);
    navigate('/');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--slate-200)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7, #0d9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
          }}>
            <HeartPulse size={22} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.35rem',
              color: 'var(--navy-900)',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              Med<span style={{ color: 'var(--teal-600)' }}>Connect</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--slate-500)', fontWeight: 600, letterSpacing: '0.04em' }}>
              TELECONSULTATION
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--primary-600)' : 'var(--navy-800)',
              position: 'relative',
              padding: '0.4rem 0',
              borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent'
            })}
          >
            Home
          </NavLink>

          <NavLink 
            to="/doctors" 
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--primary-600)' : 'var(--navy-800)',
              padding: '0.4rem 0',
              borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent'
            })}
          >
            Find Doctors
          </NavLink>

          <NavLink 
            to="/symptoms" 
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--primary-600)' : 'var(--navy-800)',
              padding: '0.4rem 0',
              borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent'
            })}
          >
            Symptom Checker
          </NavLink>

          <NavLink 
            to="/appointments" 
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.92rem',
              color: isActive ? 'var(--primary-600)' : 'var(--navy-800)',
              padding: '0.4rem 0',
              borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent'
            })}
          >
            My Appointments
          </NavLink>

          {/* Quick link to role-specific dashboard */}
          {isAuthenticated && role === 'patient' && (
            <NavLink 
              to="/patient-dashboard"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--primary-600)' : 'var(--navy-800)',
                padding: '0.4rem 0',
                borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent'
              })}
            >
              Dashboard
            </NavLink>
          )}

          {isAuthenticated && role === 'doctor' && (
            <NavLink 
              to="/doctor-dashboard"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? 'var(--teal-600)' : 'var(--navy-800)',
                padding: '0.4rem 0',
                borderBottom: isActive ? '2px solid var(--teal-600)' : '2px solid transparent'
              })}
            >
              Doctor Portal
            </NavLink>
          )}

          {isAuthenticated && role === 'admin' && (
            <NavLink 
              to="/admin/verification"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.92rem',
                color: isActive ? '#dc2626' : 'var(--navy-800)',
                padding: '0.4rem 0',
                borderBottom: isActive ? '2px solid #dc2626' : '2px solid transparent'
              })}
            >
              Verification Panel
            </NavLink>
          )}
        </nav>

        {/* Right Controls: Role Switcher & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Quick Demo Switcher (Great for Reviewers) */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.8rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--primary-700)',
                cursor: 'pointer'
              }}
              title="Quickly switch demo role for project review"
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: role === 'patient' ? '#0ea5e9' : role === 'doctor' ? '#14b8a6' : role === 'admin' ? '#ef4444' : '#94a3b8'
              }} />
              <span>Role: <strong style={{ textTransform: 'capitalize' }}>{role}</strong></span>
              <ChevronDown size={14} />
            </button>

            {roleDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                backgroundColor: 'white',
                border: '1px solid var(--slate-200)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                minWidth: '220px',
                zIndex: 110
              }}>
                <div style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Reviewer Role Switcher
                </div>
                {demoAccounts.map(acc => (
                  <button
                    key={acc.role}
                    onClick={() => handleRoleChange(acc.role)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.5rem 0.6rem',
                      textAlign: 'left',
                      background: role === acc.role ? 'var(--primary-50)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: role === acc.role ? 700 : 500,
                      color: role === acc.role ? 'var(--primary-700)' : 'var(--navy-800)'
                    }}
                  >
                    {acc.role === 'patient' && <UserIcon size={16} />}
                    {acc.role === 'doctor' && <Stethoscope size={16} />}
                    {acc.role === 'admin' && <ShieldCheck size={16} />}
                    <div>
                      <div>{acc.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)' }}>{acc.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Login */}
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--slate-100)',
                  border: '1px solid var(--slate-200)'
                }}
              >
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  <UserIcon size={18} color="var(--slate-600)" />
                )}
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy-800)', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--slate-500)',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--navy-800)',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'white',
          borderTop: '1px solid var(--slate-200)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--navy-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            Home
          </Link>
          <Link 
            to="/doctors" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--navy-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Stethoscope size={18} /> Find Doctors
          </Link>
          <Link 
            to="/symptoms" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--navy-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Activity size={18} /> Symptom Checker
          </Link>
          <Link 
            to="/appointments" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--navy-800)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Calendar size={18} /> My Appointments
          </Link>

          <hr style={{ borderColor: 'var(--slate-200)', margin: '0.5rem 0' }} />

          <Link 
            to="/patient-dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--primary-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserIcon size={18} /> Patient Dashboard
          </Link>
          <Link 
            to="/doctor-dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--teal-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Stethoscope size={18} /> Doctor Dashboard
          </Link>
          <Link 
            to="/admin/verification" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ShieldCheck size={18} /> Admin Verification
          </Link>
          <Link 
            to="/doctor-register" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--slate-600)' }}
          >
            Doctor Onboarding Registration
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};
