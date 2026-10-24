import { request } from './api';
import { Prescription, CreatePrescriptionInput } from '../types/prescription';

export const prescriptionService = {
  async getPrescriptions(patientId?: string, doctorId?: string): Promise<Prescription[]> {
    const params: Record<string, string | undefined> = {};
    if (patientId) params['patientId'] = patientId;
    if (doctorId) params['doctorId'] = doctorId;

    return await request<Prescription[]>('/prescriptions', { params });
  },

  async getPrescriptionById(id: string): Promise<Prescription> {
    return await request<Prescription>(`/prescriptions/${id}`);
  },

  async getPrescriptionByConsultationId(consultationId: string): Promise<Prescription | null> {
    const list = await request<Prescription[]>('/prescriptions', {
      params: { consultationId },
    });
    return list.length > 0 ? list[0] : null;
  },

  async createPrescription(input: CreatePrescriptionInput): Promise<Prescription> {
    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      ...input,
    };

    return await request<Prescription>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(newPrescription),
    });
  },
};
