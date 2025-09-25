// Mobile card view for suggestions.
import { useState } from 'react';
import type { Suggestion } from '../lib/types';
import { formatDateTime } from '../lib/dates';

type Props = {
  suggestion: Suggestion;
  canUpdate: boolean;
  onStatusChange: (id: string, status: Suggestion['status']) => void;
  onEmployeeClick: (employeeId: string) => void;
};

const STATUS_OPTIONS: Suggestion['status'][] = [
  'pending',
  'in_progress',
  'completed',
  'dismissed',
];

export default function SuggestionCard({
  suggestion,
  canUpdate,
  onStatusChange,
  onEmployeeClick,
}: Props) {
  const [busy, setBusy] = useState(false);

  const handleStatusChange = async (status: Suggestion['status']) => {
    if (!canUpdate || busy) return;
    setBusy(true);
    try {
      await onStatusChange(suggestion.id, status);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <button
            className="text-left font-medium text-blue-600 hover:text-blue-800"
            onClick={() => onEmployeeClick(suggestion.employeeId)}
          >
            {suggestion.employeeId}
          </button>
          <div className="text-sm text-gray-600 mt-1">
            {suggestion.type} • {suggestion.source} • {suggestion.priority}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {formatDateTime(suggestion.dateUpdated)}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="text-sm">{suggestion.description}</div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <select
            disabled={!canUpdate || busy}
            className="border rounded px-2 py-1 text-sm disabled:opacity-50"
            value={suggestion.status}
            onChange={(e) =>
              handleStatusChange(e.target.value as Suggestion['status'])
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        {suggestion.estimatedCost && (
          <div className="text-sm text-gray-600">
            {suggestion.estimatedCost}
          </div>
        )}
      </div>

      {/* Notes */}
      {suggestion.notes && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <strong>Notes:</strong> {suggestion.notes}
        </div>
      )}
    </div>
  );
}
