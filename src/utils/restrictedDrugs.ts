// Demonstration of rules-based pharmaceutical compliance and controlled substance restrictions

export interface RestrictedDrugRule {
  name: string;
  category: 'Schedule II Narcotic' | 'High-Risk Controlled Sedative' | 'Special Permit Restricted';
  reason: string;
  alternativeSuggestion: string;
}

export const RESTRICTED_DRUGS_CATALOG: RestrictedDrugRule[] = [
  {
    name: 'Morphine',
    category: 'Schedule II Narcotic',
    reason: 'Schedule II Opioid: Telemedicine prescription prohibited without an in-person physical examination and specialized state DEA license.',
    alternativeSuggestion: 'Consider non-opioid analgesics (e.g., Acetaminophen, NSAIDs) or refer patient to a pain management clinic.',
  },
  {
    name: 'Oxycodone',
    category: 'Schedule II Narcotic',
    reason: 'Schedule II Controlled Substance: High dependency risk. Strictly blocked on outpatient teleconsultation platforms.',
    alternativeSuggestion: 'Consider multimodal non-controlled analgesics under appropriate clinical guidance.',
  },
  {
    name: 'Fentanyl',
    category: 'Schedule II Narcotic',
    reason: 'Extreme potency opioid. High lethal overdose risk. Prohibited for virtual prescription.',
    alternativeSuggestion: 'Immediate hospital or palliative care referral required.',
  },
  {
    name: 'Diazepam',
    category: 'High-Risk Controlled Sedative',
    reason: 'Schedule IV Benzodiazepine: Restricted for virtual prescription without prior verified clinical history.',
    alternativeSuggestion: 'Consider non-benzodiazepine anxiolytic options or psychiatric evaluation.',
  },
  {
    name: 'Alprazolam',
    category: 'High-Risk Controlled Sedative',
    reason: 'Benzodiazepine with rapid tolerance and dependence profile. Virtual prescription restricted.',
    alternativeSuggestion: 'Recommend cognitive behavioral therapy or first-line SSRI therapy.',
  },
  {
    name: 'Methadone',
    category: 'Schedule II Narcotic',
    reason: 'Opioid maintenance and severe pain agent requiring specialized SAMHSA/DEA clinic registration.',
    alternativeSuggestion: 'Refer to certified specialized addiction recovery or pain facility.',
  },
];

export function checkPrescriptionCompliance(drugName: string): RestrictedDrugRule | null {
  if (!drugName || drugName.trim() === '') return null;
  const normalized = drugName.trim().toLowerCase();

  for (const rule of RESTRICTED_DRUGS_CATALOG) {
    if (normalized.includes(rule.name.toLowerCase())) {
      return rule;
    }
  }

  return null;
}
