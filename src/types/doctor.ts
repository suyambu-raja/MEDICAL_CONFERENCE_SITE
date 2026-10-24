export type VerificationStatus = 'approved' | 'pending' | 'rejected';

export interface AvailableSlot {
  date: string;
  timeSlots: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  location: string;
  rating: number;
  reviewCount: number;
  avatarUrl: string;
  bio: string;
  languages: string[];
  email: string;
  phone: string;
  clinicAddress: string;
  verificationStatus: VerificationStatus;
  isAvailable: boolean;
  verificationDocumentName?: string;
  availableSlots: AvailableSlot[];
}

export interface DoctorRegistrationInput {
  name: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  consultationFee: number;
  location: string;
  email: string;
  phone: string;
  clinicAddress: string;
  bio: string;
  languages: string[];
  documentName?: string;
  selectedDays?: string[];
}
