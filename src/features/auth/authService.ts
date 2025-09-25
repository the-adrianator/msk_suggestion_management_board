// Mock auth service storing a lightweight session in localStorage.
// Purpose: demonstrate role/permission gating without external providers.
import type { AdminSession, AdminUser } from '../../lib/types';

const LOCAL_STORAGE_KEY = 'msk_admin_session';

class AuthService {
  // Reads current session; resilient to parse errors.
  getCurrentSession(): AdminSession | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AdminSession) : null;
    } catch {
      return null;
    }
  }

  // Signs in using a saved user or a manual email entry.
  // Defaults ensure a usable demo experience.
  signIn(
    user:
      | AdminUser
      | { email: string; name?: string; role?: string; permissions?: string[] }
  ): AdminSession {
    // Coerce to session shape
    const session: AdminSession = {
      email: user.email,
      name: user.name || user.email,
      role: user.role || 'Admin',
      permissions: user.permissions || [
        'view_all',
        'create_suggestions',
        'update_status',
      ],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
    return session;
  }

  // Clears session to simulate sign-out.
  signOut(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  // Simple permission check helper.
  hasPermission(session: AdminSession | null, permission: string): boolean {
    if (!session) return false;
    return session.permissions.includes(permission);
  }
}

export const authService = new AuthService();
