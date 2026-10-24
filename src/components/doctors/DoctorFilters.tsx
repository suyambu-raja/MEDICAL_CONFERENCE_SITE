import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { DoctorFilterParams } from '../../services/doctorService';

interface DoctorFiltersProps {
  filters: DoctorFilterParams;
  onChange: (filters: DoctorFilterParams) => void;
  onReset: () => void;
  specialties: string[];
  locations: string[];
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  filters,
  onChange,
  onReset,
  specialties,
  locations,
}) => {
  return (
    <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'end'
      }}>
        {/* Search Input */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={15} color="var(--primary-600)" />
            Search Doctor Name
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Dr. Sarah Mitchell..."
            value={filters.search || ''}
            onChange={e => onChange({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Specialty Filter */}
        <div>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} color="var(--teal-600)" />
            Medical Specialty
          </label>
          <select
            className="form-select"
            value={filters.specialty || 'All Specialties'}
            onChange={e => onChange({ ...filters, specialty: e.target.value })}
          >
            <option value="All Specialties">All Specialties</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="form-label">Clinic / Practice Location</label>
          <select
            className="form-select"
            value={filters.location || 'All Locations'}
            onChange={e => onChange({ ...filters, location: e.target.value })}
          >
            <option value="All Locations">All Locations</option>
            {locations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Availability Toggle & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '0.5rem' }}>
          <label style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--navy-800)',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={!!filters.isAvailable}
              onChange={e => onChange({ ...filters, isAvailable: e.target.checked ? true : undefined })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
            />
            Available Only
          </label>

          <button
            type="button"
            onClick={onReset}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RotateCcw size={14} /> Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};
