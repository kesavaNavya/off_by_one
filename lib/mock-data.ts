import { Case, DRSeverity } from './types';

export const MOCK_CASES: Case[] = [
  {
    id: 'case_001',
    patient_name: 'John Doe',
    age: 45,
    gender: 'M',
    status: 'Pending',
    image_path: '/uploads/sample-retina-1.jpg',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    doctor_id: 'user_demo',
  },
  {
    id: 'case_002',
    patient_name: 'Jane Smith',
    age: 38,
    gender: 'F',
    status: 'In Progress',
    prediction: 'Mild',
    confidence: 0.87,
    image_path: '/uploads/sample-retina-2.jpg',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    doctor_id: 'user_demo',
  },
  {
    id: 'case_003',
    patient_name: 'Robert Johnson',
    age: 52,
    gender: 'M',
    status: 'Resolved',
    prediction: 'Moderate',
    confidence: 0.92,
    image_path: '/uploads/sample-retina-3.jpg',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    resolved_at: new Date(Date.now() - 86400000).toISOString(),
    doctor_id: 'user_demo',
  },
];

export function getCasesFromStorage(): Case[] {
  if (typeof window === 'undefined') return MOCK_CASES;
  const stored = localStorage.getItem('cases');
  return stored ? JSON.parse(stored) : MOCK_CASES;
}

export function saveCasesToStorage(cases: Case[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cases', JSON.stringify(cases));
  }
}

export function getCaseById(id: string): Case | undefined {
  return getCasesFromStorage().find(c => c.id === id);
}

export function addCase(caseData: Omit<Case, 'id' | 'created_at'>): Case {
  const newCase: Case = {
    ...caseData,
    id: `case_${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const cases = getCasesFromStorage();
  cases.push(newCase);
  saveCasesToStorage(cases);
  return newCase;
}

export function updateCase(id: string, updates: Partial<Case>): Case | undefined {
  const cases = getCasesFromStorage();
  const index = cases.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  
  cases[index] = { ...cases[index], ...updates };
  saveCasesToStorage(cases);
  return cases[index];
}

export function resolveCase(id: string): Case | undefined {
  return updateCase(id, {
    status: 'Resolved',
    resolved_at: new Date().toISOString(),
  });
}

export function getDashboardStats(doctorId: string) {
  const cases = getCasesFromStorage().filter(c => c.doctor_id === doctorId);
  
  return {
    total: cases.length,
    pending: cases.filter(c => c.status === 'Pending').length,
    inProgress: cases.filter(c => c.status === 'In Progress').length,
    resolved: cases.filter(c => c.status === 'Resolved').length,
  };
}
