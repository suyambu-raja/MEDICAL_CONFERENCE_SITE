import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  Info, 
  Stethoscope, 
  Calendar, 
  User as UserIcon,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { consultationService } from '../services/consultationService';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { Consultation, ChatMessage } from '../types/consultation';
import { Appointment } from '../types/appointment';
import { Doctor } from '../types/doctor';
import { VideoPlaceholder } from '../components/consultation/VideoPlaceholder';
import { ChatPanel } from '../components/consultation/ChatPanel';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ConsultationPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initConsultation() {
      try {
        setLoading(true);
        let apt: Appointment;

        if (appointmentId) {
          try {
            apt = await appointmentService.getAppointmentById(appointmentId);
          } catch {
            // If not found by exact ID, fallback to first appointment
            const allApts = await appointmentService.getAppointments();
            if (allApts.length > 0) apt = allApts[0];
            else throw new Error('No appointment found');
          }
        } else {
          const allApts = await appointmentService.getAppointments();
          if (allApts.length > 0) apt = allApts[0];
          else throw new Error('No appointment record available');
        }

        setAppointment(apt);

        // Fetch Doctor details
        try {
          const docData = await doctorService.getDoctorById(apt.doctorId);
          setDoctor(docData);
        } catch {
          // Fallback doc
        }

        // Fetch or create consultation session
        const consult = await consultationService.getOrCreateConsultation(
          apt.id,
          apt.doctorId,
          apt.patientId
        );
        setConsultation(consult);
        setMessages(consult.chatMessages || []);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Error establishing consultation room';
        setError(msg);
      } finally {
        setLoading(false);
      }
    }

    initConsultation();
  }, [appointmentId]);

  const handleSendMessage = async (text: string) => {
    if (!consultation) return;

    const newPatientMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = [...messages, newPatientMsg];
    setMessages(updated);

    try {
      await consultationService.addChatMessage(consultation.id, newPatientMsg, messages);
    } catch {
      // Local state is preserved
    }

    // Simulated doctor response after 1.5 seconds for engaging interactive demo!
    setTimeout(async () => {
      const simulatedReplies = [
        "I understand. That is consistent with the initial assessment. Let us make sure you stay comfortable.",
        "Thank you for sharing that detail. How long have you noticed this particular symptom?",
        "I will document that in your clinical encounter notes right away.",
        "Based on this, I am going to prescribe a safe first-line medication and advise on follow-up.",
      ];
      const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];

      const doctorReply: ChatMessage = {
        id: `msg-doc-${Date.now()}`,
        sender: 'doctor',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, doctorReply]);

      try {
        await consultationService.addChatMessage(consultation.id, doctorReply, updated);
      } catch {
        // Local state works seamlessly
      }
    }, 1500);
  };

  const handleEndCall = async () => {
    if (confirm('Conclude this teleconsultation and proceed to prescription & clinical summary?')) {
      if (consultation) {
        try {
          await consultationService.endConsultation(consultation.id);
        } catch {
          // Ignore
        }
      }
      if (appointment) {
        try {
          await appointmentService.updateAppointmentStatus(appointment.id, 'completed');
        } catch {
          // Ignore
        }
      }
      // Navigate to prescription page
      navigate(`/prescriptions/new?appointmentId=${appointment?.id}&consultationId=${consultation?.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container page-container">
        <LoadingSpinner message="Entering encrypted teleconsultation room..." />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container page-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
        <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
        <h2>Unable to Access Consultation Room</h2>
        <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>{error}</p>
        <Link to="/appointments" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="container page-container">
      {/* Top Bar with Consultation Info & Action to Prescriptions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem',
        backgroundColor: 'white',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/appointments')}
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <ArrowLeft size={14} /> Exit Room
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--navy-900)' }}>
                Consultation: {appointment.doctorName}
              </h2>
              <span className="badge badge-approved">Session Active</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate-500)', marginTop: '0.15rem' }}>
              Patient: <strong>{appointment.patientName}</strong> • Reason: {appointment.reason}
            </div>
          </div>
        </div>

        {/* Action to create / view prescription */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link
            to={`/prescriptions/new?appointmentId=${appointment.id}&consultationId=${consultation?.id}`}
            className="btn btn-secondary btn-sm"
          >
            <FileText size={15} /> Clinical Prescription Generator
          </Link>
        </div>
      </div>

      {/* Main Grid: Video Stream (Left) & Chat (Right) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.6fr) minmax(320px, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Video Placeholder */}
        <div>
          <VideoPlaceholder
            doctor={doctor}
            status={consultation?.status || 'active'}
            onEndCall={handleEndCall}
          />

          {/* Session Overview Card */}
          <div className="card" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                Encounter Reference
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                Session #{consultation?.id || 'con-demo'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                Specialty
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                {appointment.doctorSpecialty}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                Scheduled Slot
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy-900)' }}>
                {appointment.date} • {appointment.time}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div>
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            doctorName={doctor?.name || appointment.doctorName}
          />
        </div>
      </div>
    </div>
  );
};
