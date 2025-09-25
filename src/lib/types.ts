// Core data types for the MSK Suggestion Management Board

export interface Employee {
  id: string;
  name: string;
  department: string;
  riskLevel: 'high' | 'medium' | 'low';
  jobTitle: string;
  workstation: string;
  lastAssessment: string; // ISO timestamp
}

export interface Suggestion {
  id: string;
  employeeId: string;
  type: 'exercise' | 'equipment' | 'behavioural' | 'lifestyle';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  source: 'vida' | 'admin';
  createdBy: string; // email if source=admin
  dateCreated: string; // ISO timestamp
  dateUpdated: string; // ISO timestamp
  dateCompleted?: string; // ISO timestamp, only set when status=completed
  notes?: string;
  estimatedCost?: string; // e.g., "£85.00"
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  permissions: string[]; // e.g., ['create_suggestions', 'update_status', 'view_all']
}

// Mock auth session
export interface AdminSession {
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

// Filter and search types
export interface SuggestionFilters {
  employeeId?: string;
  type?: string;
  status?: string;
  source?: string;
  priority?: string;
  searchText?: string;
}

// Status update payload
export interface StatusUpdate {
  id: string;
  status: Suggestion['status'];
  notes?: string;
}

// Create suggestion payload
export interface CreateSuggestionPayload {
  employeeId: string;
  type: Suggestion['type'];
  description: string;
  priority?: Suggestion['priority'];
  notes?: string;
  estimatedCost?: string;
}
