// Side drawer showing employee details.
import { useEffect } from 'react';
import type { Employee } from '../lib/types';
import { formatDate } from '../lib/dates';

type Props = {
  employeeId: string | null;
  employees: Employee[];
  isOpen: boolean;
  onClose: () => void;
};

export default function EmployeeDrawer({
  employeeId,
  employees,
  isOpen,
  onClose,
}: Props) {
  const employee = employees.find((e) => e.id === employeeId);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !employee) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Employee Details</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Employee Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1 text-sm">{employee.name}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <div className="mt-1 text-sm">{employee.department}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <div className="mt-1 text-sm">{employee.jobTitle}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Risk Level
              </label>
              <div className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.riskLevel === 'high'
                      ? 'bg-red-100 text-red-800'
                      : employee.riskLevel === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {employee.riskLevel}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Workstation
              </label>
              <div className="mt-1 text-sm">{employee.workstation}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Assessment
              </label>
              <div className="mt-1 text-sm">
                {formatDate(employee.lastAssessment)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
