import { request } from './api';
import { Appointment, AppointmentStatus, CreateAppointmentInput } from '../types/appointment';

export const appointmentService = {
  async getAppointments(patientId?: string, doctorId?: string): Promise<Appointment[]> {
    const params: Record<string, string | undefined> = {};
    if (patientId) params['patientId'] = patientId;
    if (doctorId) params['doctorId'] = doctorId;

    return await request<Appointment[]>('/appointments', { params });
  },

  async getAppointmentById(id: string): Promise<Appointment> {
    return await request<Appointment>(`/appointments/${id}`);
  },

  async createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: input.patientId,
      patientName: input.patientName,
      doctorId: input.doctorId,
      doctorName: input.doctorName,
      doctorSpecialty: input.doctorSpecialty,
      doctorAvatar: input.doctorAvatar,
      date: input.date,
      time: input.time,
      reason: input.reason,
      symptoms: input.symptoms || [],
      status: 'confirmed',
      fee: input.fee,
      consultationType: input.consultationType || 'video',
      createdAt: new Date().toISOString(),
    };

    return await request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(newAppointment),
    });
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    return await request<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};
