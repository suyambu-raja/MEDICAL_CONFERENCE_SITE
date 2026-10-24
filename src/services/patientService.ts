import { request } from './api';
import { Patient, PatientRegistrationInput } from '../types/patient';

export const patientService = {
  async getPatients(): Promise<Patient[]> {
    return await request<Patient[]>('/patients');
  },

  async getPatientById(id: string): Promise<Patient> {
    return await request<Patient>(`/patients/${id}`);
  },

  async createPatient(input: PatientRegistrationInput): Promise<Patient> {
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      ...input,
    };

    return await request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(newPatient),
    });
  },
};
