import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  AlertCircle, 
  Clock, 
  RefreshCw, 
  Eye,
  ExternalLink,
  Users
} from 'lucide-react';
import { doctorService } from '../services/doctorService';
import { Doctor, VerificationStatus } from '../types/doctor';
import { VerificationBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminVerificationPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const loadAllDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching doctors for administrative review';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDoctors();
  }, []);

  const handleUpdateStatus = async (doctor: Doctor, newStatus: VerificationStatus) => {
    try {
      setUpdatingId(doctor.id);
      const updated = await doctorService.updateDoctorVerification(doctor.id, newStatus);
      // Update local state
      setDoctors(prev => prev.map(d => (d.id === doctor.id ? updated : d)));
    } catch (err) {
      console.error('Failed to update verification status:', err);
      alert('Failed to update verification status on JSON Server.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    if (statusFilter === 'all') return true;
    return doc.verificationStatus === statusFilter;
  });

  const pendingCount = doctors.filter(d => d.verificationStatus === 'pending').length;
  const approvedCount = doctors.filter(d => d.verificationStatus === 'approved').length;
  const rejectedCount = doctors.filter(d => d.verificationStatus === 'rejected').length;

  return (
    <div className="container page-container">
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              border: '1px solid #fecdd3',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              Administrative Console
            </span>
          </div>
          <h1 className="page-title">Medical Board Verification & Approvals</h1>
          <p className="page-subtitle">
            Review physician credential submissions. Approved doctors appear in patient-facing discovery immediately.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={loadAllDoctors}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} /> Refresh Data
          </button>
          <Link to="/doctors" className="btn btn-primary btn-sm">
            <Eye size={15} /> View Patient Directory
          </Link>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Pending Verification
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', marginTop: '0.2rem' }}>
            {pendingCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Approved & Discoverable
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857', marginTop: '0.2rem' }}>
            {approvedCount}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Rejected
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b91c1c', marginTop: '0.2rem' }}>
            {rejectedCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--slate-200)',
        marginBottom: '1.5rem'
      }}>
        {[
          { key: 'all', label: `All Doctors (${doctors.length})` },
          { key: 'pending', label: `Pending Review (${pendingCount})` },
          { key: 'approved', label: `Approved (${approvedCount})` },
          { key: 'rejected', label: `Rejected (${rejectedCount})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as 'all' | 'pending' | 'approved' | 'rejected')}
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: statusFilter === tab.key ? 'var(--primary-600)' : 'var(--slate-500)',
              borderBottom: statusFilter === tab.key ? '2px solid var(--primary-600)' : '2px solid transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table / List */}
      {loading ? (
        <LoadingSpinner message="Fetching clinician registrations from JSON Server..." />
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #ef4444' }}>
          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#dc2626' }}>{error}</h3>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-500)' }}>
          No doctor records found matching status: <strong>{statusFilter}</strong>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredDoctors.map(doctor => {
            const isProcessing = updatingId === doctor.id;

            return (
              <div
                key={doctor.id}
                className="card"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  borderLeft: `4px solid ${
                    doctor.verificationStatus === 'approved'
                      ? '#10b981'
                      : doctor.verificationStatus === 'pending'
                      ? '#f59e0b'
                      : '#ef4444'
                  }`
                }}
              >
                {/* Doctor Basic Summary */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '280px', flex: 2 }}>
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--navy-900)' }}>
                        {doctor.name}
                      </h3>
                      <VerificationBadge status={doctor.verificationStatus} />
                    </div>

                    <div style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {doctor.specialty} • {doctor.qualifications}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                      Experience: {doctor.experienceYears} Years • Location: {doctor.location}
                    </div>
                  </div>
                </div>

                {/* Document Information */}
                <div style={{ flex: 1.5, minWidth: '220px', fontSize: '0.85rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Submitted License Document
                  </span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--navy-800)',
                    fontWeight: 600,
                    marginTop: '0.2rem',
                    backgroundColor: 'var(--slate-50)',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--slate-200)',
                    wordBreak: 'break-all'
                  }}>
                    <FileText size={15} color="var(--primary-600)" />
                    <span>{doctor.verificationDocumentName || 'State_Medical_License.pdf'}</span>
                  </div>
                </div>

                {/* Admin Approval Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {doctor.verificationStatus !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(doctor, 'approved')}
                      disabled={isProcessing}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <CheckCircle2 size={15} /> {isProcessing ? 'Updating...' : 'Approve'}
                    </button>
                  )}

                  {doctor.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(doctor, 'rejected')}
                      disabled={isProcessing}
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      <XCircle size={15} /> {isProcessing ? 'Updating...' : 'Reject'}
                    </button>
                  )}

                  {doctor.verificationStatus === 'approved' && (
                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, padding: '0.4rem 0.6rem' }}>
                      Active in Discovery
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
