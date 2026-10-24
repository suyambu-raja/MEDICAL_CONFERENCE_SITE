import { request } from './api';
import { Doctor, DoctorRegistrationInput, VerificationStatus } from '../types/doctor';

export interface DoctorFilterParams {
  specialty?: string;
  location?: string;
  search?: string;
  isAvailable?: boolean;
  verificationStatus?: VerificationStatus;
}

export const doctorService = {
  // Retrieve doctors (patient-facing discovery only fetches approved doctors by default)
  async getDoctors(filters?: DoctorFilterParams): Promise<Doctor[]> {
    const params: Record<string, string | boolean | undefined> = {};

    if (filters?.verificationStatus) {
      params['verificationStatus'] = filters.verificationStatus;
    } else {
      // Default to approved doctors for patient discovery
      params['verificationStatus'] = 'approved';
    }

    if (filters?.specialty && filters.specialty !== 'All Specialties') {
      params['specialty'] = filters.specialty;
    }

    if (filters?.isAvailable !== undefined) {
      params['isAvailable'] = filters.isAvailable;
    }

    const doctors = await request<Doctor[]>('/doctors', { params });

    // Client-side text/location filter if needed to handle partial matching
    let filtered = doctors;
    if (filters?.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      filtered = filtered.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
      );
    }

    if (filters?.location && filters.location !== 'All Locations') {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter(d => d.location.toLowerCase().includes(loc));
    }

    return filtered;
  },

  // Get all doctors regardless of verification (for admin view)
  async getAllDoctors(): Promise<Doctor[]> {
    return await request<Doctor[]>('/doctors');
  },

  // Retrieve single doctor by ID
  async getDoctorById(id: string): Promise<Doctor> {
    return await request<Doctor>(`/doctors/${id}`);
  },

  // Register a new doctor with 'pending' verification status
  async registerDoctor(input: DoctorRegistrationInput): Promise<Doctor> {
    const newDoctor: Omit<Doctor, 'id'> & { id: string } = {
      id: `doc-${Date.now()}`,
      name: input.name.startsWith('Dr.') ? input.name : `Dr. ${input.name}`,
      specialty: input.specialty,
      qualifications: input.qualifications,
      experienceYears: Number(input.experienceYears) || 1,
      consultationFee: Number(input.consultationFee) || 50,
      location: input.location,
      rating: 5.0,
      reviewCount: 0,
      avatarUrl: `https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400`,
      bio: input.bio || `Specialist in ${input.specialty} providing virtual and clinic consultations.`,
      languages: input.languages && input.languages.length > 0 ? input.languages : ['English'],
      email: input.email,
      phone: input.phone,
      clinicAddress: input.clinicAddress,
      verificationStatus: 'pending',
      isAvailable: true,
      verificationDocumentName: input.documentName || 'Medical_Practice_License.pdf',
      availableSlots: [
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          timeSlots: ['10:00 AM', '01:30 PM', '03:30 PM'],
        },
      ],
    };

    return await request<Doctor>('/doctors', {
      method: 'POST',
      body: JSON.stringify(newDoctor),
    });
  },

  // Admin approval/rejection patch
  async updateDoctorVerification(id: string, status: VerificationStatus): Promise<Doctor> {
    return await request<Doctor>(`/doctors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ verificationStatus: status }),
    });
  },

  // Toggle doctor availability (online / offline)
  async toggleDoctorAvailability(id: string, isAvailable: boolean): Promise<Doctor> {
    return await request<Doctor>(`/doctors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });
  },
};
