// Root shell: mounts Auth panel and, later, the dashboard.
import './App.css';
import AuthPanel from './components/AuthPanel';
import { useState } from 'react';
import { useAuth } from './features/auth/useAuth';
import { useSuggestions } from './features/suggestions/useSuggestions';
import { useEmployees } from './features/employees/useEmployees';
import DashboardTable from './components/DashboardTable';
import DashboardFilters from './components/DashboardFilters';
import SuggestionCard from './components/SuggestionCard';
import EmployeeDrawer from './components/EmployeeDrawer';

function App() {
  const { session, can } = useAuth();
  const { suggestions, filters, setFilters, refresh } =
    useSuggestions('dateUpdated');
  const { employees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  const handleStatusChange = async () => {
    // This will be handled by the individual components
    await refresh();
  };

  const handleEmployeeClick = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        MSK Suggestion Management Board (Admin)
      </h1>
      <AuthPanel />
      <div className="text-sm text-gray-700">
        <div>
          Permissions: {session ? session.permissions.join(', ') : 'Signed out'}
        </div>
        <div className="mt-2">
          Can create: {can.create ? 'Yes' : 'No'} · Can update status:{' '}
          {can.updateStatus ? 'Yes' : 'No'}
        </div>
      </div>
      <DashboardFilters
        filters={filters}
        onFiltersChange={setFilters}
        employees={employees}
      />
      {/* Desktop Table */}
      <div className="hidden md:block">
        <DashboardTable
          suggestions={suggestions}
          canUpdate={can.updateStatus}
          onRefresh={refresh}
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            suggestion={suggestion}
            canUpdate={can.updateStatus}
            onStatusChange={handleStatusChange}
            onEmployeeClick={handleEmployeeClick}
          />
        ))}
        {suggestions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No suggestions found.
          </div>
        )}
      </div>

      {/* Employee Drawer */}
      <EmployeeDrawer
        employeeId={selectedEmployeeId}
        employees={employees}
        isOpen={selectedEmployeeId !== null}
        onClose={() => setSelectedEmployeeId(null)}
      />
    </div>
  );
}

export default App;
