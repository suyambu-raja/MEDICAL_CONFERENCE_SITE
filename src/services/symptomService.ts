import { request } from './api';
import { SymptomAssessment, SymptomQuery, EmergencyRedFlag } from '../types/symptom';

export const RED_FLAG_SYMPTOMS: EmergencyRedFlag[] = [
  {
    id: 'rf-chest-pain',
    title: 'Crushing or radiating chest pain',
    description: 'Severe chest pressure spreading to jaw, neck, back, or left arm.',
    actionRequired: 'Call emergency services (e.g. 911 / 112 / 999) or proceed immediately to the nearest Emergency Department.',
  },
  {
    id: 'rf-shortness-breath',
    title: 'Severe shortness of breath or blue lips',
    description: 'Inability to speak in full sentences, gasping, or cyanosis (bluish tint around lips/nails).',
    actionRequired: 'Seek immediate emergency resuscitation care. Do not drive yourself.',
  },
  {
    id: 'rf-stroke-fast',
    title: 'Sudden facial droop, arm weakness, or slurred speech (FAST)',
    description: 'Sudden neurological deficit, unilateral weakness, or severe confusion.',
    actionRequired: 'Acute stroke signs require immediate emergency paramedic intervention within minutes.',
  },
  {
    id: 'rf-anaphylaxis',
    title: 'Severe allergic reaction with throat/tongue swelling',
    description: 'Stridor, difficulty swallowing, throat tightness, or widespread sudden hives with fainting.',
    actionRequired: 'Administer epinephrine autoinjector if available and summon emergency medical assistance instantly.',
  },
  {
    id: 'rf-blood-loss',
    title: 'Coughing up significant blood or uncontrolled hemorrhaging',
    description: 'Hemoptysis, vomiting blood, or trauma with profuse bleeding.',
    actionRequired: 'Immediate emergency hospital triage required.',
  },
];

export const COMMON_SYMPTOMS_CATALOG = [
  { id: 'sym-fever', label: 'Fever or Chills', category: 'General' },
  { id: 'sym-cough', label: 'Persistent Cough', category: 'Respiratory' },
  { id: 'sym-fatigue', label: 'Unusual Fatigue / Weakness', category: 'General' },
  { id: 'sym-throat', label: 'Sore Throat', category: 'ENT' },
  { id: 'sym-palpitations', label: 'Heart Palpitations / Fluttering', category: 'Cardiovascular' },
  { id: 'sym-headache', label: 'Tension / Throbbing Headache', category: 'Neurological' },
  { id: 'sym-rash', label: 'Skin Rash or Itching', category: 'Dermatological' },
  { id: 'sym-joint', label: 'Joint Pain or Stiffness', category: 'Musculoskeletal' },
  { id: 'sym-sinus', label: 'Sinus Pressure / Nasal Congestion', category: 'ENT' },
  { id: 'sym-dizziness', label: 'Lightheadedness / Mild Dizziness', category: 'Neurological' },
  { id: 'sym-stomach', label: 'Mild Indigestion / Nausea', category: 'Gastrointestinal' },
];

export const symptomService = {
  async getSymptomAssessments(): Promise<SymptomAssessment[]> {
    return await request<SymptomAssessment[]>('/symptomAssessments');
  },

  async evaluateQuery(query: SymptomQuery): Promise<SymptomAssessment> {
    const assessments = await this.getSymptomAssessments();
    const queryTokens = [
      ...query.selectedSymptoms.map(s => s.toLowerCase()),
      ...(query.additionalNotes ? query.additionalNotes.toLowerCase().split(/\s+/) : []),
    ];

    // Find the best matching assessment by keyword frequency
    let bestMatch = assessments[0];
    let highestScore = -1;

    for (const assessment of assessments) {
      let score = 0;
      for (const keyword of assessment.keywords) {
        for (const token of queryTokens) {
          if (token.includes(keyword) || keyword.includes(token)) {
            score += 2;
          }
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = assessment;
      }
    }

    return bestMatch || assessments[0];
  },
};
