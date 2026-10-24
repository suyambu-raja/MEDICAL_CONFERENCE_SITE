import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';
import { doctorService, DoctorFilterParams } from '../services/doctorService';
import { Doctor } from '../types/doctor';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { DoctorFilters } from '../components/doctors/DoctorFilters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const FindDoctorsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpecialty = searchParams.get('specialty') || 'All Specialties';

  const [filters, setFilters] = useState<DoctorFilterParams>({
    specialty: initialSpecialty,
    search: '',
    location: 'All Locations',
    isAvailable: undefined,
    verificationStatus: 'approved', // Patient-facing discovery only displays approved doctors!
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync if URL query changes
  useEffect(() => {
    const urlSpecialty = searchParams.get('specialty');
    if (urlSpecialty && urlSpecialty !== filters.specialty) {
      setFilters(prev => ({ ...prev, specialty: urlSpecialty }));
    }
  }, [searchParams]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctors(filters);
      setDoctors(data);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching doctors';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [filters]);

  // Extract unique specialties and locations from data or standard catalog
  const { specialtiesList, locationsList } = useMemo(() => {
    const specs = [
      'Cardiology',
      'Dermatology',
      'Neurology',
      'General Medicine',
      'Pediatrics',
      'Orthopedics',
      'Psychiatry',
      'ENT (Otolaryngology)',
    ];
    const locs = [
      'Boston',
      'San Francisco',
      'New York',
      'Chicago',
      'Philadelphia',
      'Seattle',
      'Austin',
    ];
    return { specialtiesList: specs, locationsList: locs };
  }, []);

  const handleReset = () => {
    setSearchParams({});
    setFilters({
      specialty: 'All Specialties',
      search: '',
      location: 'All Locations',
      isAvailable: undefined,
      verificationStatus: 'approved',
    });
  };

  return (
    <div className="page-container container">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-approved">
            <CheckCircle2 size={13} /> Medical Board Certified
          </span>
        </div>
        <h1 className="page-title">Find Approved Doctors</h1>
        <p className="page-subtitle">
          Search and book virtual teleconsultations with verified healthcare practitioners.
        </p>
      </div>

      {/* Filter Component */}
      <DoctorFilters
        filters={filters}
        onChange={newFilters => setFilters(newFilters)}
        onReset={handleReset}
        specialties={specialtiesList}
        locations={locationsList}
      />

      {/* Results Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        fontSize: '0.9rem',
        color: 'var(--slate-500)'
      }}>
        <div>
          Showing <strong>{doctors.length}</strong> verified {doctors.length === 1 ? 'doctor' : 'doctors'}
        </div>
        {filters.specialty !== 'All Specialties' && (
          <span style={{
            backgroundColor: 'var(--primary-50)',
            color: 'var(--primary-700)',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600
          }}>
            Filtered by: {filters.specialty}
          </span>
        )}
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <LoadingSpinner message="Searching verified doctors via JSON Server..." />
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #ef4444' }}>
          <AlertCircle size={36} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#991b1b', marginBottom: '0.5rem' }}>Failed to Load Doctors</h3>
          <p style={{ color: 'var(--slate-600)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            {error}
          </p>
          <button onClick={loadDoctors} className="btn btn-outline btn-sm">
            Retry Connection
          </button>
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No Approved Doctors Found"
          description="Try broadening your search criteria or resetting filters to view all available verified specialists."
          actionText="Clear All Filters"
          onAction={handleReset}
          icon={<Stethoscope size={30} />}
        />
      ) : (
        <div className="grid-3">
          {doctors.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};
