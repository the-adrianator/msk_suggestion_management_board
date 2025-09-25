// Compact mock admin auth panel.
// Enables sign-in via demo list or manual email for the demo.
import { useMemo, useState } from 'react';
import { useAuth } from '../features/auth/useAuth';
import { sampleAdminUsers } from '../lib/sampleData';

export default function AuthPanel() {
  const { session, signIn, signOut } = useAuth();
  const [manualEmail, setManualEmail] = useState('');

  const users = useMemo(() => sampleAdminUsers, []);

  return (
    <div className="p-4 border rounded-md space-y-3">
      <div className="font-semibold">Admin Auth</div>

      {session ? (
        <div className="space-y-2">
          <div className="text-sm">
            Signed in as: <span className="font-medium">{session.name}</span>
          </div>
          <div className="text-xs text-gray-600">
            {session.email} · {session.role}
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm">Sign in as</label>
            <select
              className="border rounded px-2 py-1"
              defaultValue=""
              onChange={(e) => {
                const email = e.target.value;
                const user = users.find((u) => u.email === email);
                if (user) signIn(user);
              }}
            >
              <option value="" disabled>
                Choose admin…
              </option>
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              className="border rounded px-2 py-1 flex-1"
              placeholder="or type email…"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />
            <button
              className="px-3 py-1 border rounded"
              onClick={() => manualEmail && signIn({ email: manualEmail })}
            >
              Sign in
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
