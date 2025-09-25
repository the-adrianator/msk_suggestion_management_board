// Root shell: mounts Auth panel and, later, the dashboard.
import './App.css';
import AuthPanel from './components/AuthPanel';
import { useAuth } from './features/auth/useAuth';

function App() {
  const { session, can } = useAuth();

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
      <div className="border rounded p-4 text-sm text-gray-600">
        Dashboard will appear here in Stage 3.
      </div>
    </div>
  );
}

export default App;
