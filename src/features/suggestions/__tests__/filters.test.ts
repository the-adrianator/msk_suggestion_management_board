import { filterSuggestions, sortSuggestions } from '../filters';
import type { Suggestion, SuggestionFilters } from '../../../lib/types';

// Sample test data
const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    employeeId: 'emp001',
    type: 'equipment',
    description: 'Standing desk needed',
    status: 'pending',
    priority: 'high',
    source: 'vida',
    createdBy: 'vida-system',
    dateCreated: '2024-01-15T10:30:00Z',
    dateUpdated: '2024-01-15T10:30:00Z',
    notes: 'Employee has back pain',
  },
  {
    id: '2',
    employeeId: 'emp002',
    type: 'exercise',
    description: 'Stretching routine',
    status: 'completed',
    priority: 'medium',
    source: 'admin',
    createdBy: 'admin@company.com',
    dateCreated: '2024-01-10T09:15:00Z',
    dateUpdated: '2024-01-20T14:30:00Z',
    dateCompleted: '2024-01-20T14:30:00Z',
  },
  {
    id: '3',
    employeeId: 'emp001',
    type: 'behavioural',
    description: 'Posture improvement',
    status: 'in_progress',
    priority: 'low',
    source: 'admin',
    createdBy: 'hr@company.com',
    dateCreated: '2024-01-12T11:20:00Z',
    dateUpdated: '2024-01-18T16:45:00Z',
  },
];

describe('filterSuggestions', () => {
  it('should return all suggestions when no filters applied', () => {
    const result = filterSuggestions(mockSuggestions, {});
    expect(result).toHaveLength(3);
  });

  it('should filter by employee ID', () => {
    const filters: SuggestionFilters = { employeeId: 'emp001' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.employeeId === 'emp001')).toBe(true);
  });

  it('should filter by type', () => {
    const filters: SuggestionFilters = { type: 'equipment' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('equipment');
  });

  it('should filter by status', () => {
    const filters: SuggestionFilters = { status: 'completed' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('completed');
  });

  it('should filter by source', () => {
    const filters: SuggestionFilters = { source: 'admin' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(2);
    expect(result.every((s) => s.source === 'admin')).toBe(true);
  });

  it('should filter by priority', () => {
    const filters: SuggestionFilters = { priority: 'high' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe('high');
  });

  it('should filter by search text in description', () => {
    const filters: SuggestionFilters = { searchText: 'standing' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].description).toContain('Standing');
  });

  it('should filter by search text in notes', () => {
    const filters: SuggestionFilters = { searchText: 'back pain' };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].notes).toContain('back pain');
  });

  it('should apply multiple filters', () => {
    const filters: SuggestionFilters = {
      employeeId: 'emp001',
      status: 'pending',
    };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(1);
    expect(result[0].employeeId).toBe('emp001');
    expect(result[0].status).toBe('pending');
  });

  it('should return empty array when no matches', () => {
    const filters: SuggestionFilters = {
      employeeId: 'nonexistent',
    };
    const result = filterSuggestions(mockSuggestions, filters);
    expect(result).toHaveLength(0);
  });
});

describe('sortSuggestions', () => {
  it('should sort by dateUpdated descending by default', () => {
    const result = sortSuggestions(mockSuggestions);
    expect(result[0].id).toBe('2'); // Most recent (2024-01-20)
    expect(result[1].id).toBe('3'); // Second most recent (2024-01-18)
    expect(result[2].id).toBe('1'); // Oldest (2024-01-15)
  });

  it('should sort by priority descending', () => {
    const result = sortSuggestions(mockSuggestions, 'priority', 'desc');
    expect(result[0].priority).toBe('high');
    expect(result[1].priority).toBe('medium');
    expect(result[2].priority).toBe('low');
  });

  it('should sort by status ascending', () => {
    const result = sortSuggestions(mockSuggestions, 'status', 'asc');
    expect(result[0].status).toBe('pending'); // First in ascending order
    expect(result[1].status).toBe('in_progress');
    expect(result[2].status).toBe('completed');
  });
});
