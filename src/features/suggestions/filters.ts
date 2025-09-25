// Pure filtering/sorting utilities for suggestions.
// Keeps UI predictable and testable.
import type { Suggestion, SuggestionFilters } from '../../lib/types';

/**
 * Pure function to filter suggestions based on criteria
 */
export const filterSuggestions = (
  suggestions: Suggestion[],
  filters: SuggestionFilters
): Suggestion[] => {
  return suggestions.filter((suggestion) => {
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
      const descriptionMatch = suggestion.description
        .toLowerCase()
        .includes(searchLower);
      const notesMatch =
        suggestion.notes?.toLowerCase().includes(searchLower) || false;

      if (!descriptionMatch && !notesMatch) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Sort suggestions by various criteria
 */
export const sortSuggestions = (
  suggestions: Suggestion[],
  sortBy: 'dateUpdated' | 'priority' | 'status' = 'dateUpdated',
  order: 'asc' | 'desc' = 'desc'
): Suggestion[] => {
  return [...suggestions].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'dateUpdated':
        comparison =
          new Date(a.dateUpdated).getTime() - new Date(b.dateUpdated).getTime();
        break;
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 } as const;
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      case 'status': {
        const statusOrder = {
          completed: 4,
          in_progress: 3,
          pending: 2,
          dismissed: 1,
        } as const;
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      }
    }

    return order === 'desc' ? -comparison : comparison;
  });
};
