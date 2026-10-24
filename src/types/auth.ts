export type UserRole = 'patient' | 'doctor' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  doctorId?: string;
  patientId?: string;
  specialty?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
}
