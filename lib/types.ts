export type CaseStatus = 'Pending' | 'In Progress' | 'Resolved';
export type DRSeverity = 'None' | 'Mild' | 'Moderate' | 'Severe' | 'Proliferative';

export interface Case {
  id: string;
  patient_name: string;
  age: number;
  gender: string;
  status: CaseStatus;
  prediction?: DRSeverity;
  confidence?: number;
  image_path: string;
  created_at: string;
  resolved_at?: string;
  doctor_id: string;
}

export interface Report {
  id: string;
  case_id: string;
  report_content: string;
  generated_at: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  };
}
