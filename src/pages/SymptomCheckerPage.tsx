import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Activity, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  ShieldAlert, 
  Stethoscope, 
  Sparkles,
  Info
} from 'lucide-react';
import { symptomService, RED_FLAG_SYMPTOMS, COMMON_SYMPTOMS_CATALOG } from '../services/symptomService';
import { doctorService } from '../services/doctorService';
import { SymptomAssessment, EmergencyRedFlag } from '../types/symptom';
import { Doctor } from '../types/doctor';
import { DoctorCard } from '../components/doctors/DoctorCard';
import { UrgencyBadge } from '../components/common/Badge';

export const SymptomCheckerPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptomInput, setCustomSymptomInput] = useState('');
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<SymptomAssessment | null>(null);
  const [matchingDoctors, setMatchingDoctors] = useState<Doctor[]>([]);
  const [triggeredEmergency, setTriggeredEmergency] = useState<EmergencyRedFlag | null>(null);

  // Toggle symptom tag
  const toggleSymptom = (label: string) => {
    if (selectedSymptoms.includes(label)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== label));
    } else {
      setSelectedSymptoms([...selectedSymptoms, label]);
    }
  };

  // Add custom typed symptom
  const handleAddCustomSymptom = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!customSymptomInput.trim()) return;
    if (!selectedSymptoms.includes(customSymptomInput.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptomInput.trim()]);
    }
    setCustomSymptomInput('');
  };

  // Check red flag emergency symptom selection
  const handleSelectRedFlag = (redFlag: EmergencyRedFlag) => {
    // Immediately trigger emergency override!
    setTriggeredEmergency(redFlag);
    setAssessmentResult(null);
    setMatchingDoctors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedSymptoms.length === 0 && !additionalNotes.trim()) {
      alert('Please select or describe at least one symptom.');
      return;
    }

    try {
      setIsSubmitting(true);
      setTriggeredEmergency(null);

      // Evaluate query through mock REST API
      const result = await symptomService.evaluateQuery({
        selectedSymptoms,
        duration,
        severity,
        additionalNotes,
      });

      setAssessmentResult(result);

      // Fetch matching doctors for the suggested specialty
      const docs = await doctorService.getDoctors({
        specialty: result.matchedDoctorSpecialty,
        verificationStatus: 'approved',
      });
      setMatchingDoctors(docs);
    } catch (err) {
      console.error('Error evaluating symptoms:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetChecker = () => {
    setSelectedSymptoms([]);
    setCustomSymptomInput('');
    setDuration('1-3 days');
    setSeverity('moderate');
    setAdditionalNotes('');
    setAssessmentResult(null);
    setMatchingDoctors([]);
    setTriggeredEmergency(null);
  };

  return (
    <div className="container page-container">
      {/* Header */}
      <div className="page-header" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-700)',
          border: '1px solid var(--primary-200)',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '0.75rem'
        }}>
          <Sparkles size={14} /> Clinical Decision Support System
        </div>
        <h1 className="page-title">Interactive Symptom Checker</h1>
        <p className="page-subtitle" style={{ margin: '0 auto' }}>
          Describe what you are experiencing to receive simulated triage guidance and discover suitable certified doctors.
        </p>
      </div>

      {/* Demonstration Disclaimer Alert */}
      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '2rem',
        fontSize: '0.86rem',
        color: '#1e40af'
      }}>
        <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Medical Demonstration Notice:</strong> This symptom checker is an educational prototype providing decision-support recommendations based on mock REST responses. It does not provide medical diagnoses or prescribe medications. In case of acute health risk, use emergency services.
        </div>
      </div>

      {/* Emergency Red-Flag Banner if Triggered */}
      {triggeredEmergency && (
        <div className="emergency-banner" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={32} color="#dc2626" />
            <div>
              <h2 style={{ color: '#991b1b', fontSize: '1.4rem', margin: 0 }}>
                EMERGENCY SAFETY OVERRIDE TRIGGERED
              </h2>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#b91c1c' }}>
                {triggeredEmergency.title}
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: '#7f1d1d', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {triggeredEmergency.description} <strong>{triggeredEmergency.actionRequired}</strong>
          </p>

          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            border: '1px solid #fca5a5',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem',
                borderRadius: '50%'
              }}>
                <PhoneCall size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#991b1b' }}>Call 911 / 112 Immediately</div>
                <div style={{ fontSize: '0.8rem', color: '#7f1d1d' }}>Standard teleconsultation workflow is suspended.</div>
              </div>
            </div>

            <button
              onClick={handleResetChecker}
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#f87171', color: '#991b1b' }}
            >
              Reset Symptom Checker
            </button>
          </div>
        </div>
      )}

      {/* Main Checker Workflow if No Emergency Override */}
      {!triggeredEmergency && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: assessmentResult ? '1fr 1fr' : '1fr',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Input Form Column */}
          <div className="card" style={{ borderTop: '4px solid var(--primary-600)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--navy-900)' }}>
              1. Report Presenting Symptoms
            </h3>

            {/* Quick Emergency Red-Flag Selector Demonstration */}
            <div style={{
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9f1239', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={16} /> Red-Flag Emergency Demonstration Override:
              </div>
              <p style={{ fontSize: '0.78rem', color: '#881337', marginBottom: '0.6rem' }}>
                Test immediate safety interception by clicking any critical red-flag indicator:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {RED_FLAG_SYMPTOMS.slice(0, 3).map(rf => (
                  <button
                    key={rf.id}
                    type="button"
                    onClick={() => handleSelectRedFlag(rf)}
                    style={{
                      background: '#ffe4e6',
                      border: '1px solid #f43f5e',
                      color: '#9f1239',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ⚠️ {rf.title}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Common Symptoms Cloud */}
              <div className="form-group">
                <label className="form-label">
                  Select Common Symptoms:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                  {COMMON_SYMPTOMS_CATALOG.map(s => {
                    const isSelected = selectedSymptoms.includes(s.label);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSymptom(s.label)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          border: isSelected ? '1px solid var(--primary-600)' : '1px solid var(--slate-200)',
                          backgroundColor: isSelected ? 'var(--primary-600)' : 'var(--slate-50)',
                          color: isSelected ? 'white' : 'var(--navy-800)'
                        }}
                      >
                        {isSelected && '✓ '} {s.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom symptom input */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Or type custom symptom and press enter..."
                    value={customSymptomInput}
                    onChange={e => setCustomSymptomInput(e.target.value)}
                    onKeyDown={handleAddCustomSymptom}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSymptom}
                    className="btn btn-outline btn-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected List */}
              {selectedSymptoms.length > 0 && (
                <div style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--primary-50)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem'
                }}>
                  <strong style={{ color: 'var(--primary-800)', display: 'block', marginBottom: '0.35rem' }}>
                    Currently Selected ({selectedSymptoms.length}):
                  </strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {selectedSymptoms.map(item => (
                      <span
                        key={item}
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid var(--primary-300)',
                          color: 'var(--primary-800)',
                          padding: '0.15rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => toggleSymptom(item)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate-400)', fontWeight: 'bold' }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration and Severity */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label className="form-label">Duration of Symptoms</label>
                  <select
                    className="form-select"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                  >
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="More than 2 weeks">More than 2 weeks (Chronic)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Perceived Severity</label>
                  <select
                    className="form-select"
                    value={severity}
                    onChange={e => setSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                  >
                    <option value="mild">Mild (Noticeable but manageable)</option>
                    <option value="moderate">Moderate (Interferes with daily tasks)</option>
                    <option value="severe">Severe (High discomfort)</option>
                  </select>
                </div>
              </div>

              {/* Additional notes */}
              <div className="form-group">
                <label className="form-label">Additional Clinical Notes or Context</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="e.g. Worse in the morning, triggered by coffee, no previous episodes..."
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Evaluating Symptoms with JSON Server...</span>
                ) : (
                  <>
                    <Activity size={18} /> Submit Symptoms for Assessment
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Assessment Output Column */}
          {assessmentResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ borderTop: '4px solid var(--teal-600)', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={20} color="var(--teal-600)" />
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', margin: 0 }}>
                      Symptom Assessment Result
                    </h3>
                  </div>
                  <UrgencyBadge urgency={assessmentResult.urgencyLevel} />
                </div>

                {/* Summary */}
                <div style={{
                  backgroundColor: 'var(--slate-50)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.92rem',
                  color: 'var(--navy-800)',
                  lineHeight: 1.55
                }}>
                  <strong style={{ color: 'var(--navy-900)', display: 'block', marginBottom: '0.25rem' }}>
                    Clinical Assessment Summary:
                  </strong>
                  {assessmentResult.summary}
                </div>

                {/* Suggested Specialty */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Recommended Medical Specialty
                  </span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '0.2rem' }}>
                    {assessmentResult.suggestedSpecialty}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '0.25rem' }}>
                    {assessmentResult.recommendedAction}
                  </p>
                </div>

                <div style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  border: '1px dashed var(--slate-300)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  color: 'var(--slate-500)',
                  marginBottom: '1rem'
                }}>
                  ℹ️ Non-Diagnostic Support: Generated from MedConnect mock decision rules.
                </div>

                <Link
                  to={`/doctors?specialty=${encodeURIComponent(assessmentResult.suggestedSpecialty)}`}
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Stethoscope size={16} /> View All {assessmentResult.suggestedSpecialty} Doctors
                </Link>
              </div>

              {/* Matching Doctors List */}
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.85rem', color: 'var(--navy-900)' }}>
                  Matching Specialists ({matchingDoctors.length})
                </h4>

                {matchingDoctors.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate-500)' }}>
                    No verified doctors currently matched for this specialty.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {matchingDoctors.slice(0, 2).map(doc => (
                      <DoctorCard key={doc.id} doctor={doc} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
