// Hook to load suggestions and expose client-side filtering and sorting.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { suggestionService } from './suggestionService';
import type { Suggestion, SuggestionFilters } from '../../lib/types';
import { sortSuggestions } from './filters';

export function useSuggestions(
  initialSort: 'dateUpdated' | 'priority' | 'status' = 'dateUpdated'
) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SuggestionFilters>({});
  const [sortBy, setSortBy] = useState<'dateUpdated' | 'priority' | 'status'>(
    initialSort
  );
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await suggestionService.getAll(filters);
      setSuggestions(list);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to load suggestions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sorted = useMemo(
    () => sortSuggestions(suggestions, sortBy, order),
    [suggestions, sortBy, order]
  );

  return {
    suggestions: sorted,
    raw: suggestions,
    loading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    order,
    setOrder,
    refresh,
  } as const;
}
