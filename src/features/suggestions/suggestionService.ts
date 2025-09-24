import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { getCurrentTimestamp } from '../../lib/dates';
import type {
  Suggestion,
  SuggestionFilters,
  CreateSuggestionPayload,
  StatusUpdate,
} from '../../lib/types';

/**
 * Suggestion service for Firestore operations
 */
export class SuggestionService {
  private readonly collectionName = 'suggestions';

  /**
   * Fetch all suggestions with optional filtering
   */
  async getAll(filters?: SuggestionFilters): Promise<Suggestion[]> {
    try {
      const suggestionsRef = collection(db, this.collectionName);
      let q = query(suggestionsRef, orderBy('dateUpdated', 'desc'));

      // Apply server-side filters if provided
      if (filters?.employeeId) {
        q = query(q, where('employeeId', '==', filters.employeeId));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.source) {
        q = query(q, where('source', '==', filters.source));
      }

      const snapshot = await getDocs(q);
      let suggestions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Suggestion[];

      // Apply client-side filters
      if (filters) {
        suggestions = this.filterSuggestions(suggestions, filters);
      }

      return suggestions;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      throw new Error('Failed to fetch suggestions');
    }
  }

  /**
   * Fetch single suggestion by ID
   */
  async getById(id: string): Promise<Suggestion | null> {
    try {
      const suggestionRef = doc(db, this.collectionName, id);
      const snapshot = await getDoc(suggestionRef);
      
      if (!snapshot.exists()) {
        return null;
      }
      
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Suggestion;
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      throw new Error('Failed to fetch suggestion');
    }
  }

  /**
   * Create new suggestion
   */
  async create(payload: CreateSuggestionPayload, createdBy: string): Promise<Suggestion> {
    try {
      const now = getCurrentTimestamp();
      const suggestionData = {
        ...payload,
        source: 'admin' as const,
        createdBy,
        status: 'pending' as const,
        dateCreated: now,
        dateUpdated: now,
        priority: payload.priority || 'medium',
      };

      const docRef = await addDoc(collection(db, this.collectionName), suggestionData);
      
      return {
        id: docRef.id,
        ...suggestionData,
      };
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw new Error('Failed to create suggestion');
    }
  }

  /**
   * Update suggestion status
   */
  async updateStatus(update: StatusUpdate): Promise<void> {
    try {
      const now = getCurrentTimestamp();
      const updateData: Partial<Suggestion> = {
        status: update.status,
        dateUpdated: now,
      };

      // Set completion date if status is completed
      if (update.status === 'completed') {
        updateData.dateCompleted = now;
      }

      // Add notes if provided
      if (update.notes) {
        updateData.notes = update.notes;
      }

      const suggestionRef = doc(db, this.collectionName, update.id);
      await updateDoc(suggestionRef, updateData);
    } catch (error) {
      console.error('Error updating suggestion status:', error);
      throw new Error('Failed to update suggestion status');
    }
  }

  /**
   * Client-side filtering of suggestions
   */
  filterSuggestions(suggestions: Suggestion[], filters: SuggestionFilters): Suggestion[] {
    return suggestions.filter(suggestion => {
      // Employee filter
      if (filters.employeeId && suggestion.employeeId !== filters.employeeId) {
        return false;
      }

      // Type filter
      if (filters.type && suggestion.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status && suggestion.status !== filters.status) {
        return false;
      }

      // Source filter
      if (filters.source && suggestion.source !== filters.source) {
        return false;
      }

      // Priority filter
      if (filters.priority && suggestion.priority !== filters.priority) {
        return false;
      }

      // Search text filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const descriptionMatch = suggestion.description.toLowerCase().includes(searchLower);
        const notesMatch = suggestion.notes?.toLowerCase().includes(searchLower) || false;
        
        if (!descriptionMatch && !notesMatch) {
          return false;
        }
      }

      return true;
    });
  }
}

export const suggestionService = new SuggestionService();
