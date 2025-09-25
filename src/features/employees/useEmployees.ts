// Hook to load all employees for filters and display.
import { useEffect, useState } from 'react';
import { employeeService } from './employeeService';
import type { Employee } from '../../lib/types';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    employeeService
      .getAll()
      .then((data) => {
        if (!cancelled) setEmployees(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load employees');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { employees, loading, error } as const;
}
