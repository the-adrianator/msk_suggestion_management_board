// Desktop table for suggestions with basic sorting and inline status update.
import { useMemo, useState } from 'react';
import type { Suggestion } from '../lib/types';
import { formatDateTime } from '../lib/dates';
import { suggestionService } from '../features/suggestions/suggestionService';

type Props = {
  suggestions: Suggestion[];
  canUpdate: boolean;
  onRefresh: () => void;
};

const STATUS_OPTIONS: Suggestion['status'][] = [
  'pending',
  'in_progress',
  'completed',
  'dismissed',
];

export default function DashboardTable({
  suggestions,
  canUpdate,
  onRefresh,
}: Props) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const rows = useMemo(() => suggestions, [suggestions]);

  const onChangeStatus = async (id: string, next: Suggestion['status']) => {
    if (!canUpdate) return;
    setBusyId(id);
    try {
      await suggestionService.updateStatus({ id, status: next });
      onRefresh();
    } catch (e) {
      // Optimistic behaviour would revert locally if we had local state
      console.error('Failed to update status', e);
      alert('Could not update status');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="px-3 py-2">Employee</th>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Source</th>
            <th className="px-3 py-2">Priority</th>
            <th className="px-3 py-2">Last Updated</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="px-3 py-2">{s.employeeId}</td>
              <td
                className="px-3 py-2 max-w-[28rem] truncate"
                title={s.description}
              >
                {s.description}
              </td>
              <td className="px-3 py-2 capitalize">{s.type}</td>
              <td className="px-3 py-2 capitalize">
                <span className="inline-flex items-center gap-2">
                  <span>{s.status}</span>
                </span>
              </td>
              <td className="px-3 py-2 capitalize">{s.source}</td>
              <td className="px-3 py-2 capitalize">{s.priority}</td>
              <td className="px-3 py-2">{formatDateTime(s.dateUpdated)}</td>
              <td className="px-3 py-2">
                <select
                  disabled={!canUpdate || busyId === s.id}
                  className="border rounded px-2 py-1 disabled:opacity-50"
                  value={s.status}
                  onChange={(e) =>
                    onChangeStatus(s.id, e.target.value as Suggestion['status'])
                  }
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="p-4 text-sm text-gray-600">No suggestions found.</div>
      )}
    </div>
  );
}
