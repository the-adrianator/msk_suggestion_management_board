// Root shell: mounts Auth panel and, later, the dashboard.
import './App.css';
import AuthPanel from './components/AuthPanel';
import { useAuth } from './features/auth/useAuth';
import { useSuggestions } from './features/suggestions/useSuggestions';
import { useEmployees } from './features/employees/useEmployees';
import DashboardTable from './components/DashboardTable';
import DashboardFilters from './components/DashboardFilters';

function App() {
  const { session, can } = useAuth();
  const { suggestions, filters, setFilters, refresh } =
    useSuggestions('dateUpdated');
  const { employees } = useEmployees();

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
      <DashboardTable
        suggestions={suggestions}
        canUpdate={can.updateStatus}
        onRefresh={refresh}
      />
    </div>
  );
}

export default App;
