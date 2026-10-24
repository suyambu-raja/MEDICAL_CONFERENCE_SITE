export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'in-progress';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string;
  time: string;
  reason: string;
  symptoms?: string[];
  status: AppointmentStatus;
  fee: number;
  consultationType: 'video' | 'chat';
  createdAt: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  date: string;
  time: string;
  reason: string;
  symptoms?: string[];
  fee: number;
  consultationType?: 'video' | 'chat';
}
