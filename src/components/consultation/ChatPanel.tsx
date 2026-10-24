import React, { useState, useRef, useEffect } from 'react';
import { Send, User as UserIcon, Shield, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../../types/consultation';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  doctorName?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, doctorName = 'Doctor' }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '520px',
      padding: 0,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '0.9rem 1.25rem',
        borderBottom: '1px solid var(--slate-200)',
        backgroundColor: 'var(--slate-50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h4 style={{ fontSize: '1rem', color: 'var(--navy-900)', margin: 0 }}>
            Live Clinical Chat
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Shield size={12} color="var(--teal-600)" />
            HIPAA-compliant simulated message channel
          </span>
        </div>
        <span className="badge badge-online">Connected</span>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        backgroundColor: '#fafcff'
      }}>
        {messages.map(msg => {
          if (msg.sender === 'system') {
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: 'center',
                  backgroundColor: 'var(--slate-200)',
                  color: 'var(--slate-600)',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  maxWidth: '85%',
                  textAlign: 'center'
                }}
              >
                {msg.text}
              </div>
            );
          }

          const isDoctor = msg.sender === 'doctor';

          return (
            <div
              key={msg.id}
              style={{
                alignSelf: isDoctor ? 'flex-start' : 'flex-end',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isDoctor ? 'flex-start' : 'flex-end'
              }}
            >
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--slate-400)',
                marginBottom: '0.2rem',
                fontWeight: 600,
                padding: '0 0.35rem'
              }}>
                {isDoctor ? doctorName : 'You'}
              </div>

              <div style={{
                backgroundColor: isDoctor ? 'white' : 'var(--primary-600)',
                color: isDoctor ? 'var(--navy-900)' : 'white',
                padding: '0.65rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                borderTopLeftRadius: isDoctor ? '2px' : 'var(--radius-md)',
                borderTopRightRadius: !isDoctor ? '2px' : 'var(--radius-md)',
                border: isDoctor ? '1px solid var(--slate-200)' : 'none',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.88rem',
                lineHeight: 1.45,
                wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>

              <div style={{
                fontSize: '0.68rem',
                color: 'var(--slate-400)',
                marginTop: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0 0.35rem'
              }}>
                <span>{msg.timestamp}</span>
                {!isDoctor && <CheckCheck size={12} color="var(--primary-600)" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--slate-200)',
          backgroundColor: 'white',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Type message to doctor..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', fontSize: '0.88rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0.6rem 1rem' }}
          disabled={!inputText.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
