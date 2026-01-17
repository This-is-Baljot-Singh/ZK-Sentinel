export interface Document {
  id: string;
  filename: string;
  type: string;
  uploadTimestamp: number; // Unix timestamp
  status: 'Pending' | 'Analyzed' | 'Failed';
  riskScore: number;
  sensitiveData: string[];
  fileSize: string;
  sha256: string;
  expired?: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: number; // Unix timestamp
  title: string;
  description: string;
  type: 'Upload' | 'Analysis' | 'Alert' | 'Policy Action';
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'Idle' | 'Running' | 'Completed' | 'Error';
  lastUpdated: number; // Unix timestamp
}

export interface ZKProof {
  status: 'NotGenerated' | 'Generating' | 'Generated' | 'Submitting' | 'Submitted';
  proofId?: string;
  generatedAt?: number; // Unix timestamp
  submittedAt?: number; // Unix timestamp
  network?: string;
}

export interface Settings {
  enablePIIDetection: boolean;
  autoEncrypt: boolean;
  riskThreshold: number;
  redactionLevel: 'None' | 'Partial' | 'Full';
  allowedFileTypes: string[];
  retentionDuration: 30 | 90 | 180;
  autoDeleteExpired: boolean;
  emailAlerts: boolean;
  dashboardAlerts: boolean;
  minSeverity: 'Info' | 'Warning' | 'Critical';
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  displayName?: string;
  createdAt: number;
  avatarUrl: string | null;
  provider?: 'email' | 'phone' | 'google';
  idToken?: string;
}

export interface AppState {
  documents: Document[];
  activities: ActivityEvent[];
  settings: Settings;
  agents: Agent[];
  zkProof: ZKProof;
  hasLaunched: boolean;
  isAuthenticated: boolean;
  user: User | null;
}