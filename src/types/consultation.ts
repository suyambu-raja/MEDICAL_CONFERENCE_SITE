export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'patient' | 'system';
  text: string;
  timestamp: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  status: 'scheduled' | 'active' | 'completed';
  startTime: string;
  endTime?: string;
  notes: string;
  chatMessages: ChatMessage[];
}
