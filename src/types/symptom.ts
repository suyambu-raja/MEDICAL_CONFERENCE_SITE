export interface SymptomAssessment {
  id: string;
  category: string;
  keywords: string[];
  summary: string;
  suggestedSpecialty: string;
  recommendedAction: string;
  urgencyLevel: 'Low' | 'Low to Moderate' | 'Moderate' | 'High' | 'Emergency';
  matchedDoctorSpecialty: string;
}

export interface SymptomQuery {
  selectedSymptoms: string[];
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  additionalNotes?: string;
}

export interface EmergencyRedFlag {
  id: string;
  title: string;
  description: string;
  actionRequired: string;
}
