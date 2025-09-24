import { suggestionService } from '../suggestionService';
import type { CreateSuggestionPayload } from '../../../lib/types';

// Mock Firebase
jest.mock('../../../lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
}));

describe('createSuggestion', () => {
  const mockAddDoc = require('firebase/firestore').addDoc;
  const mockCollection = require('firebase/firestore').collection;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create suggestion with required fields', async () => {
    const mockDocRef = { id: 'suggestion123' };
    mockAddDoc.mockResolvedValue(mockDocRef);
    mockCollection.mockReturnValue('mock-collection');

    const payload: CreateSuggestionPayload = {
      employeeId: 'emp001',
      type: 'equipment',
      description: 'Standing desk needed',
    };

    const result = await suggestionService.create(payload, 'admin@company.com');

    expect(mockAddDoc).toHaveBeenCalledWith(
      'mock-collection',
      expect.objectContaining({
        employeeId: 'emp001',
        type: 'equipment',
        description: 'Standing desk needed',
        source: 'admin',
        createdBy: 'admin@company.com',
        status: 'pending',
        priority: 'medium', // Default priority
        dateCreated: expect.any(String),
        dateUpdated: expect.any(String),
      })
    );

    expect(result).toEqual({
      id: 'suggestion123',
      employeeId: 'emp001',
      type: 'equipment',
      description: 'Standing desk needed',
      source: 'admin',
      createdBy: 'admin@company.com',
      status: 'pending',
      priority: 'medium',
      dateCreated: expect.any(String),
      dateUpdated: expect.any(String),
    });
  });

  it('should create suggestion with all optional fields', async () => {
    const mockDocRef = { id: 'suggestion456' };
    mockAddDoc.mockResolvedValue(mockDocRef);
    mockCollection.mockReturnValue('mock-collection');

    const payload: CreateSuggestionPayload = {
      employeeId: 'emp002',
      type: 'exercise',
      description: 'Stretching routine',
      priority: 'high',
      notes: 'Employee has neck pain',
      estimatedCost: '£50.00',
    };

    const result = await suggestionService.create(payload, 'hr@company.com');

    expect(mockAddDoc).toHaveBeenCalledWith(
      'mock-collection',
      expect.objectContaining({
        employeeId: 'emp002',
        type: 'exercise',
        description: 'Stretching routine',
        priority: 'high',
        notes: 'Employee has neck pain',
        estimatedCost: '£50.00',
        source: 'admin',
        createdBy: 'hr@company.com',
        status: 'pending',
      })
    );

    expect(result.id).toBe('suggestion456');
    expect(result.priority).toBe('high');
    expect(result.notes).toBe('Employee has neck pain');
  });

  it('should set default priority to medium when not provided', async () => {
    const mockDocRef = { id: 'suggestion789' };
    mockAddDoc.mockResolvedValue(mockDocRef);
    mockCollection.mockReturnValue('mock-collection');

    const payload: CreateSuggestionPayload = {
      employeeId: 'emp003',
      type: 'behavioural',
      description: 'Posture improvement',
    };

    await suggestionService.create(payload, 'admin@company.com');

    expect(mockAddDoc).toHaveBeenCalledWith(
      'mock-collection',
      expect.objectContaining({
        priority: 'medium',
      })
    );
  });

  it('should throw error when Firestore operation fails', async () => {
    mockAddDoc.mockRejectedValue(new Error('Firestore error'));
    mockCollection.mockReturnValue('mock-collection');

    const payload: CreateSuggestionPayload = {
      employeeId: 'emp001',
      type: 'equipment',
      description: 'Test suggestion',
    };

    await expect(
      suggestionService.create(payload, 'admin@company.com')
    ).rejects.toThrow('Failed to create suggestion');
  });
});
