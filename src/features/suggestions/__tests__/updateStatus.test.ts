import { suggestionService } from '../suggestionService';
import type { StatusUpdate } from '../../../lib/types';

// Mock Firebase
jest.mock('../../../lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('updateStatus', () => {
  const mockUpdateDoc = require('firebase/firestore').updateDoc;
  const mockDoc = require('firebase/firestore').doc;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update status to in_progress', async () => {
    mockDoc.mockReturnValue('mock-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    const update: StatusUpdate = {
      id: 'suggestion123',
      status: 'in_progress',
    };

    await suggestionService.updateStatus(update);

    expect(mockDoc).toHaveBeenCalledWith({}, 'suggestions', 'suggestion123');
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      'mock-doc-ref',
      expect.objectContaining({
        status: 'in_progress',
        dateUpdated: expect.any(String),
      })
    );
  });

  it('should set dateCompleted when status is completed', async () => {
    mockDoc.mockReturnValue('mock-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    const update: StatusUpdate = {
      id: 'suggestion456',
      status: 'completed',
    };

    await suggestionService.updateStatus(update);

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      'mock-doc-ref',
      expect.objectContaining({
        status: 'completed',
        dateUpdated: expect.any(String),
        dateCompleted: expect.any(String),
      })
    );
  });

  it('should include notes when provided', async () => {
    mockDoc.mockReturnValue('mock-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    const update: StatusUpdate = {
      id: 'suggestion789',
      status: 'dismissed',
      notes: 'Employee declined the suggestion',
    };

    await suggestionService.updateStatus(update);

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      'mock-doc-ref',
      expect.objectContaining({
        status: 'dismissed',
        dateUpdated: expect.any(String),
        notes: 'Employee declined the suggestion',
      })
    );
  });

  it('should not set dateCompleted for non-completed statuses', async () => {
    mockDoc.mockReturnValue('mock-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    const update: StatusUpdate = {
      id: 'suggestion999',
      status: 'dismissed',
    };

    await suggestionService.updateStatus(update);

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      'mock-doc-ref',
      expect.objectContaining({
        status: 'dismissed',
        dateUpdated: expect.any(String),
      })
    );

    // Should not have dateCompleted field
    const updateData = mockUpdateDoc.mock.calls[0][1];
    expect(updateData).not.toHaveProperty('dateCompleted');
  });

  it('should throw error when Firestore operation fails', async () => {
    mockDoc.mockReturnValue('mock-doc-ref');
    mockUpdateDoc.mockRejectedValue(new Error('Firestore error'));

    const update: StatusUpdate = {
      id: 'suggestion123',
      status: 'in_progress',
    };

    await expect(suggestionService.updateStatus(update)).rejects.toThrow(
      'Failed to update suggestion status'
    );
  });

  it('should handle all status transitions', async () => {
    mockDoc.mockReturnValue('mock-doc-ref');
    mockUpdateDoc.mockResolvedValue(undefined);

    const statuses: StatusUpdate['status'][] = [
      'pending',
      'in_progress',
      'completed',
      'dismissed',
    ];

    for (const status of statuses) {
      const update: StatusUpdate = {
        id: 'suggestion123',
        status,
      };

      await suggestionService.updateStatus(update);

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        'mock-doc-ref',
        expect.objectContaining({
          status,
          dateUpdated: expect.any(String),
        })
      );
    }
  });
});
