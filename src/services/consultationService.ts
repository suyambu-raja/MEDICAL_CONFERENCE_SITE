import { request } from './api';
import { Consultation, ChatMessage } from '../types/consultation';

export const consultationService = {
  async getConsultations(): Promise<Consultation[]> {
    return await request<Consultation[]>('/consultations');
  },

  async getConsultationById(id: string): Promise<Consultation> {
    return await request<Consultation>(`/consultations/${id}`);
  },

  async getConsultationByAppointmentId(appointmentId: string): Promise<Consultation | null> {
    const consultations = await request<Consultation[]>('/consultations', {
      params: { appointmentId },
    });
    return consultations.length > 0 ? consultations[0] : null;
  },

  async getOrCreateConsultation(appointmentId: string, doctorId: string, patientId: string): Promise<Consultation> {
    const existing = await this.getConsultationByAppointmentId(appointmentId);
    if (existing) {
      return existing;
    }

    const newConsultation: Consultation = {
      id: `con-${Date.now()}`,
      appointmentId,
      doctorId,
      patientId,
      status: 'active',
      startTime: new Date().toISOString(),
      notes: 'Consultation initiated. Reviewing patient reported symptoms.',
      chatMessages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'system',
          text: 'Simulated encrypted consultation room connected. Audio/video preview active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `msg-${Date.now()}-2`,
          sender: 'doctor',
          text: 'Hello! I am ready to begin our teleconsultation. How can I assist you today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    return await request<Consultation>('/consultations', {
      method: 'POST',
      body: JSON.stringify(newConsultation),
    });
  },

  async addChatMessage(consultationId: string, message: ChatMessage, existingMessages: ChatMessage[]): Promise<Consultation> {
    const updatedMessages = [...existingMessages, message];
    return await request<Consultation>(`/consultations/${consultationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ chatMessages: updatedMessages }),
    });
  },

  async updateNotes(consultationId: string, notes: string): Promise<Consultation> {
    return await request<Consultation>(`/consultations/${consultationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  },

  async endConsultation(consultationId: string): Promise<Consultation> {
    return await request<Consultation>(`/consultations/${consultationId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'completed',
        endTime: new Date().toISOString(),
      }),
    });
  },
};
