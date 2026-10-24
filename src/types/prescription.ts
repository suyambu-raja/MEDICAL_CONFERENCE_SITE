export interface PrescribedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  consultationId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicense: string;
  clinicName: string;
  date: string;
  diagnosis: string;
  clinicalNotes: string;
  medicines: PrescribedMedicine[];
  safetyWarnings: string[];
  followUpDate?: string;
}

export interface CreatePrescriptionInput {
  consultationId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicense: string;
  clinicName: string;
  date: string;
  diagnosis: string;
  clinicalNotes: string;
  medicines: PrescribedMedicine[];
  safetyWarnings: string[];
  followUpDate?: string;
}
