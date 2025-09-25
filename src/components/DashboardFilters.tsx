// Filter and search controls for the dashboard.
import { useMemo } from 'react';
import type { SuggestionFilters, Employee } from '../lib/types';

type Props = {
  filters: SuggestionFilters;
  onFiltersChange: (filters: SuggestionFilters) => void;
  employees: Employee[];
};

const TYPE_OPTIONS = [
  'exercise',
  'equipment',
  'behavioural',
  'lifestyle',
] as const;
const STATUS_OPTIONS = [
  'pending',
  'in_progress',
  'completed',
  'dismissed',
] as const;
const SOURCE_OPTIONS = ['vida', 'admin'] as const;
const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;

export default function DashboardFilters({
  filters,
  onFiltersChange,
  employees,
}: Props) {
  const employeeOptions = useMemo(
    () => employees.map((e) => ({ id: e.id, name: e.name })),
    [employees]
  );

  const updateFilter = (
    key: keyof SuggestionFilters,
    value: string | undefined
  ) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="space-y-4 p-4 border rounded bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Employee Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Employee</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.employeeId || ''}
            onChange={(e) => updateFilter('employeeId', e.target.value)}
          >
            <option value="">All employees</option>
            {employeeOptions.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.type || ''}
            onChange={(e) => updateFilter('type', e.target.value)}
          >
            <option value="">All categories</option>
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Source</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.source || ''}
            onChange={(e) => updateFilter('source', e.target.value)}
          >
            <option value="">All sources</option>
            {SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={filters.priority || ''}
            onChange={(e) => updateFilter('priority', e.target.value)}
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            placeholder="Search descriptions and notes..."
            value={filters.searchText || ''}
            onChange={(e) => updateFilter('searchText', e.target.value)}
          />
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          onClick={() => onFiltersChange({})}
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
}
