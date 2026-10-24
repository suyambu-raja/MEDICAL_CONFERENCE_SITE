import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  ArrowLeft,
  Stethoscope,
  Clock,
  Sparkles
} from 'lucide-react';
import { prescriptionService } from '../services/prescriptionService';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { patientService } from '../services/patientService';
import { checkPrescriptionCompliance, RESTRICTED_DRUGS_CATALOG, RestrictedDrugRule } from '../utils/restrictedDrugs';
import { Prescription, PrescribedMedicine } from '../types/prescription';
import { Appointment } from '../types/appointment';
import { Doctor } from '../types/doctor';
import { Patient } from '../types/patient';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PrescriptionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const consultationId = searchParams.get('consultationId');
  const viewOnlyId = searchParams.get('view');
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  // Form fields
  const [diagnosis, setDiagnosis] = useState('Acute Upper Respiratory Tract Irritation with Pharyngitis');
  const [clinicalNotes, setClinicalNotes] = useState('Patient reported symptoms for 3 days. Vitals normal. Recommend hydration and oral antihistamines.');
  const [medicines, setMedicines] = useState<PrescribedMedicine[]>([
    {
      name: 'Cetirizine 10mg',
      dosage: '10 mg',
      frequency: 'Once daily at night',
      duration: '5 days',
      instructions: 'Take after dinner with water.',
    },
    {
      name: 'Paracetamol 500mg',
      dosage: '500 mg',
      frequency: 'Every 8 hours if fever > 100°F',
      duration: '3 days',
      instructions: 'Do not exceed 3000mg in 24 hours.',
    },
  ]);

  // Drug compliance validation state
  const [complianceViolation, setComplianceViolation] = useState<RestrictedDrugRule | null>(null);
  const [savedPrescription, setSavedPrescription] = useState<Prescription | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadContext() {
      try {
        setLoading(true);

        if (viewOnlyId) {
          const existing = await prescriptionService.getPrescriptionById(viewOnlyId);
          setSavedPrescription(existing);
          setLoading(false);
          return;
        }

        // Try to load appointment
        let apt: Appointment | null = null;
        if (appointmentId) {
          try {
            apt = await appointmentService.getAppointmentById(appointmentId);
          } catch {
            // Ignore
          }
        }

        if (!apt) {
          const apts = await appointmentService.getAppointments();
          apt = apts[0] || null;
        }

        setAppointment(apt);

        if (apt) {
          try {
            const doc = await doctorService.getDoctorById(apt.doctorId);
            setDoctor(doc);
          } catch {
            // Fallback
          }

          try {
            const pat = await patientService.getPatientById(apt.patientId);
            setPatient(pat);
          } catch {
            // Fallback
          }
        }
      } catch (err) {
        console.error('Error loading prescription context:', err);
      } finally {
        setLoading(false);
      }
    }

    loadContext();
  }, [appointmentId, viewOnlyId]);

  // Real-time compliance check across medicines
  useEffect(() => {
    for (const med of medicines) {
      const violation = checkPrescriptionCompliance(med.name);
      if (violation) {
        setComplianceViolation(violation);
        return;
      }
    }
    setComplianceViolation(null);
  }, [medicines]);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: '',
        dosage: '1 tablet',
        frequency: 'Twice daily after meals',
        duration: '5 days',
        instructions: 'Take with plenty of water.',
      },
    ]);
  };

  const handleUpdateMedicine = (index: number, field: keyof PrescribedMedicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleInjectRestrictedDrugDemo = (restrictedDrugName: string) => {
    setMedicines([
      ...medicines,
      {
        name: restrictedDrugName,
        dosage: '10 mg',
        frequency: 'Every 6 hours PRN',
        duration: '7 days',
        instructions: 'Controlled substance test.',
      },
    ]);
  };

  const handleGeneratePrescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (complianceViolation) {
      alert(`Compliance Violation: ${complianceViolation.name} is a restricted controlled drug and cannot be prescribed virtually.`);
      return;
    }

    if (medicines.length === 0) {
      alert('Please include at least one medication.');
      return;
    }

    try {
      setIsSubmitting(true);

      const created = await prescriptionService.createPrescription({
        consultationId: consultationId || 'con-demo-session',
        appointmentId: appointment?.id || 'apt-101',
        patientId: patient?.id || 'pat-1',
        patientName: patient?.name || appointment?.patientName || 'Alex Johnson',
        patientAge: 32,
        patientGender: patient?.gender || 'Male',
        doctorId: doctor?.id || 'doc-1',
        doctorName: doctor?.name || appointment?.doctorName || 'Dr. Sarah Mitchell',
        doctorSpecialty: doctor?.specialty || appointment?.doctorSpecialty || 'General Medicine',
        doctorLicense: 'MED-BOARD-US-99412',
        clinicName: doctor?.clinicAddress || 'Beacon Telehealth Pavilion',
        date: new Date().toISOString().split('T')[0],
        diagnosis: diagnosis.trim(),
        clinicalNotes: clinicalNotes.trim(),
        medicines,
        safetyWarnings: [
          'Take medications strictly as directed on the label.',
          'Store in a cool, dry place out of reach of children.',
          'If adverse allergic reactions occur, stop immediately and seek emergency medical care.',
        ],
        followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      });

      setSavedPrescription(created);
    } catch (err) {
      console.error('Error generating prescription:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container page-container">
        <LoadingSpinner message="Loading clinical prescription module..." />
      </div>
    );
  }

  // Printable Final Prescription Preview
  if (savedPrescription) {
    return (
      <div className="container page-container" style={{ maxWidth: '780px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }} className="no-print">
          <button
            onClick={() => setSavedPrescription(null)}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft size={14} /> Back to Editor
          </button>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} /> Print / Save PDF
            </button>
            <Link to="/appointments" className="btn btn-outline btn-sm">
              My Appointments
            </Link>
          </div>
        </div>

        {/* Prescription Paper Sheet */}
        <div className="card" style={{
          backgroundColor: 'white',
          padding: '2.5rem',
          border: '2px solid var(--slate-300)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)'
        }} id="printable-prescription">
          {/* Clinic Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '2px solid var(--primary-600)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <h2 style={{ color: 'var(--primary-700)', fontSize: '1.5rem', marginBottom: '0.2rem' }}>
                MedConnect Telehealth Network
              </h2>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate-600)' }}>
                {savedPrescription.clinicName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                Official Telemedicine e-Prescription System • Board License #{savedPrescription.doctorLicense}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: 0 }}>
                {savedPrescription.doctorName}
              </h3>
              <div style={{ color: 'var(--teal-600)', fontWeight: 600, fontSize: '0.85rem' }}>
                {savedPrescription.doctorSpecialty}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                Date: <strong>{savedPrescription.date}</strong>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            backgroundColor: 'var(--slate-50)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.88rem'
          }}>
            <div>
              <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Patient Name
              </span>
              <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{savedPrescription.patientName}</div>
            </div>
            <div>
              <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Age / Gender
              </span>
              <div>{savedPrescription.patientAge} Years / {savedPrescription.patientGender}</div>
            </div>
            <div>
              <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                Prescription ID
              </span>
              <div style={{ fontFamily: 'monospace', fontWeight: 700 }}>#{savedPrescription.id}</div>
            </div>
          </div>

          {/* Clinical Diagnosis */}
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
              Primary Diagnosis & Findings
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginTop: '0.2rem' }}>
              {savedPrescription.diagnosis}
            </div>
            {savedPrescription.clinicalNotes && (
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.35rem' }}>
                {savedPrescription.clinicalNotes}
              </p>
            )}
          </div>

          {/* Rx Symbol & Medication Table */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'serif',
              color: 'var(--primary-600)',
              marginBottom: '0.5rem',
              lineHeight: 1
            }}>
              ℞
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-100)', borderBottom: '2px solid var(--slate-300)' }}>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: 'var(--navy-900)' }}>#</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: 'var(--navy-900)' }}>Medication & Strength</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: 'var(--navy-900)' }}>Dosage & Timing</th>
                  <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontWeight: 700, color: 'var(--navy-900)' }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {savedPrescription.medicines.map((med, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--slate-200)' }}>
                    <td style={{ padding: '0.75rem', color: 'var(--slate-400)', fontWeight: 600 }}>{idx + 1}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong style={{ color: 'var(--navy-900)', display: 'block' }}>{med.name}</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>{med.instructions}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--slate-700)' }}>
                      {med.frequency}
                    </td>
                    <td style={{ padding: '0.75rem', color: 'var(--slate-700)' }}>
                      {med.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Safety & Follow-up */}
          <div style={{
            borderTop: '1px dashed var(--slate-300)',
            paddingTop: '1rem',
            marginBottom: '2rem',
            fontSize: '0.82rem',
            color: 'var(--slate-600)'
          }}>
            <strong>Special Clinical Advice:</strong>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem' }}>
              {savedPrescription.safetyWarnings?.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
            {savedPrescription.followUpDate && (
              <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--primary-700)' }}>
                Recommended Follow-Up Date: {savedPrescription.followUpDate}
              </div>
            )}
          </div>

          {/* Doctor Signature Block */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.5rem', borderTop: '1px solid var(--slate-200)' }}>
            <div style={{ textAlign: 'center', minWidth: '220px' }}>
              <div style={{
                fontFamily: 'cursive',
                fontSize: '1.4rem',
                color: 'var(--primary-700)',
                borderBottom: '1px solid var(--slate-400)',
                paddingBottom: '0.35rem',
                marginBottom: '0.35rem'
              }}>
                {savedPrescription.doctorName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                Authorized Digital Medical Board Signature
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media print {
            .no-print, header, footer { display: none !important; }
            body { background: white !important; }
            #printable-prescription { border: none !important; box-shadow: none !important; padding: 0 !important; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container page-container" style={{ maxWidth: '900px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h1 className="page-title">Prescription Generation & Compliance Engine</h1>
        <p className="page-subtitle">
          Demonstration of rules-based pharmaceutical compliance and outpatient teleconsultation validation.
        </p>
      </div>

      {/* Compliance Demonstration Tester Card */}
      <div style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
          <ShieldAlert size={18} /> Rules-Based Restricted Drug Compliance Demonstration:
        </div>
        <p style={{ fontSize: '0.84rem', color: '#78350f', marginBottom: '0.75rem' }}>
          MedConnect implements hardcoded safety rules preventing controlled narcotic prescriptions via teleconsultations. Click any sample restricted substance to test compliance blocking:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {RESTRICTED_DRUGS_CATALOG.map(rule => (
            <button
              key={rule.name}
              type="button"
              onClick={() => handleInjectRestrictedDrugDemo(rule.name)}
              style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                color: '#92400e',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⛔ Test: {rule.name} ({rule.category})
            </button>
          ))}
        </div>
      </div>

      {/* Violation Alert Banner if Active */}
      {complianceViolation && (
        <div className="emergency-banner" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ color: '#991b1b', fontSize: '1.15rem', marginBottom: '0.25rem' }}>
                COMPLIANCE WARNING: RESTRICTED SUBSTANCE DETECTED ({complianceViolation.name.toUpperCase()})
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#7f1d1d', marginBottom: '0.5rem' }}>
                {complianceViolation.reason}
              </p>
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #fca5a5',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: '#991b1b'
              }}>
                <strong>Clinical Compliance Recommendation:</strong> {complianceViolation.alternativeSuggestion}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b91c1c', marginTop: '0.5rem', fontWeight: 700 }}>
                ⚠️ Final prescription generation is BLOCKED until this restricted substance is removed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Prescription Creation Form */}
      <form onSubmit={handleGeneratePrescription} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Encounter Context Header */}
        <div className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: 'var(--slate-50)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Patient
            </span>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
              {patient?.name || appointment?.patientName || 'Alex Johnson'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Age 32 • ID: {patient?.id || 'pat-1'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Attending Doctor
            </span>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>
              {doctor?.name || appointment?.doctorName || 'Dr. Sarah Mitchell'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--teal-600)' }}>
              {doctor?.specialty || appointment?.doctorSpecialty || 'Cardiology'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 700, textTransform: 'uppercase' }}>
              Encounter Reference
            </span>
            <div style={{ fontWeight: 700, color: 'var(--primary-700)', fontSize: '0.95rem' }}>
              #{appointment?.id || 'apt-101'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              Teleconsultation Verified
            </div>
          </div>
        </div>

        {/* Diagnosis & Clinical Notes */}
        <div className="card">
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--navy-900)' }}>
            1. Clinical Assessment & Diagnosis
          </h3>

          <div className="form-group">
            <label className="form-label">Diagnosis / Primary Finding</label>
            <input
              type="text"
              className="form-control"
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g. Mild Sinus Arrhythmia / Contact Dermatitis"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Clinical Encounter Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              placeholder="Document patient observations, vitals reviewed, and advice..."
            />
          </div>
        </div>

        {/* Prescribed Items Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-900)', margin: 0 }}>
              2. Medication Items
            </h3>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Plus size={14} /> Add Medicine
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {medicines.map((med, index) => {
              const itemViolation = checkPrescriptionCompliance(med.name);

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: itemViolation ? '#fff1f2' : 'var(--slate-50)',
                    border: itemViolation ? '1px solid #fecdd3' : '1px solid var(--slate-200)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: itemViolation ? '#be123c' : 'var(--navy-900)' }}>
                      Medication #{index + 1} {itemViolation && '⛔ (RESTRICTED SUBSTANCE)'}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Medicine Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Amoxicillin 500mg"
                        value={med.name}
                        onChange={e => handleUpdateMedicine(index, 'name', e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Dosage & Strength</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 500 mg"
                        value={med.dosage}
                        onChange={e => handleUpdateMedicine(index, 'dosage', e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Frequency</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Twice daily after food"
                        value={med.frequency}
                        onChange={e => handleUpdateMedicine(index, 'frequency', e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: '0.78rem' }}>Duration</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 7 days"
                        value={med.duration}
                        onChange={e => handleUpdateMedicine(index, 'duration', e.target.value)}
                        required
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.88rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Specific Instructions</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Drink full glass of water, avoid dairy..."
                      value={med.instructions}
                      onChange={e => handleUpdateMedicine(index, 'instructions', e.target.value)}
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isSubmitting || !!complianceViolation}
            style={{ width: '100%' }}
          >
            {isSubmitting ? (
              'Validating & Saving to REST API...'
            ) : complianceViolation ? (
              '⛔ Resolve Compliance Warning to Generate Prescription'
            ) : (
              <>
                <FileText size={18} /> Generate Compliant e-Prescription
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
