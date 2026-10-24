import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Monitor, ShieldCheck, Volume2 } from 'lucide-react';
import { Doctor } from '../../types/doctor';

interface VideoPlaceholderProps {
  doctor?: Doctor | null;
  onEndCall?: () => void;
  status: string;
}

export const VideoPlaceholder: React.FC<VideoPlaceholderProps> = ({ doctor, onEndCall, status }) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(145); // Start at 2m 25s for immediate realistic feel

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#090d16',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      height: '520px'
    }}>
      {/* Top Overlay: Session Info, Encryption, Timer */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '1rem 1.25rem',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            color: '#34d399',
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: '1px solid rgba(52, 211, 153, 0.4)'
          }}>
            <ShieldCheck size={13} /> Encrypted WebRTC Demo
          </span>
          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
            Status: <strong style={{ textTransform: 'capitalize', color: '#38bdf8' }}>{status}</strong>
          </span>
        </div>

        <div style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 700,
          fontFamily: 'monospace',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          {formatDuration(callDuration)}
        </div>
      </div>

      {/* Main Video View: Doctor Remote Stream */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
      }}>
        {doctor ? (
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.25rem' }}>
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid var(--primary-500)',
                  boxShadow: '0 0 35px rgba(14, 165, 233, 0.4)'
                }}
              />
              {/* Simulated Audio Wave Animation */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                backgroundColor: 'var(--teal-600)',
                color: 'white',
                borderRadius: '50%',
                padding: '0.45rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Volume2 size={16} />
              </div>
            </div>

            <h3 style={{ color: 'white', fontSize: '1.35rem', marginBottom: '0.25rem' }}>
              {doctor.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              {doctor.specialty} • {doctor.qualifications}
            </p>
          </div>
        ) : (
          <div style={{ color: '#94a3b8', textAlign: 'center' }}>
            <h3>Connecting to Doctor Stream...</h3>
          </div>
        )}

        {/* Demo Watermark Notice */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '1.25rem',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          padding: '0.4rem 0.8rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.72rem',
          color: '#cbd5e1',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'none'
        }}>
          💡 Demonstration Mode: Video and audio feeds are simulated for project evaluation.
        </div>

        {/* Self-View PiP (Picture in Picture) */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '1.25rem',
          width: '130px',
          height: '95px',
          backgroundColor: isVideoOff ? '#1e293b' : '#334155',
          borderRadius: 'var(--radius-md)',
          border: '2px solid rgba(255, 255, 255, 0.25)',
          overflow: 'hidden',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5
        }}>
          {isVideoOff ? (
            <VideoOff size={22} color="#94a3b8" />
          ) : (
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"
              alt="Patient Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <span style={{
            position: 'absolute',
            bottom: '4px',
            left: '6px',
            fontSize: '0.65rem',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '0.1rem 0.35rem',
            borderRadius: '3px'
          }}>
            You (Patient)
          </span>
        </div>
      </div>

      {/* Control Bar */}
      <div style={{
        backgroundColor: '#0f172a',
        borderTop: '1px solid #1e293b',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        zIndex: 10
      }}>
        {/* Toggle Audio */}
        <button
          onClick={() => setIsMicMuted(!isMicMuted)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: isMicMuted ? '#ef4444' : '#1e293b',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMicMuted ? <MicOff size={19} /> : <Mic size={19} />}
        </button>

        {/* Toggle Video */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: isVideoOff ? '#ef4444' : '#1e293b',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
        >
          {isVideoOff ? <VideoOff size={19} /> : <VideoIcon size={19} />}
        </button>

        {/* Screen Share */}
        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: isScreenSharing ? 'var(--teal-600)' : '#1e293b',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Share Clinical Report / Screen"
        >
          <Monitor size={19} />
        </button>

        {/* End Call */}
        <button
          onClick={onEndCall}
          style={{
            height: '44px',
            padding: '0 1.25rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.88rem'
          }}
          title="End Teleconsultation"
        >
          <PhoneOff size={18} />
          <span>Conclude Call</span>
        </button>
      </div>
    </div>
  );
};
