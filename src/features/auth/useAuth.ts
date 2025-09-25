// React hook bridging authService into components.
// Keeps concerns tidy and enables simple permission checks.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { authService } from './authService';
import type { AdminSession, AdminUser } from '../../lib/types';

export const useAuth = () => {
  const [session, setSession] = useState<AdminSession | null>(null);

  // Restore any prior mock session.
  useEffect(() => {
    setSession(authService.getCurrentSession());
  }, []);

  // Accepts demo users or ad-hoc emails.
  const signIn = useCallback(
    (
      user:
        | AdminUser
        | {
            email: string;
            name?: string;
            role?: string;
            permissions?: string[];
          }
    ) => {
      const s = authService.signIn(user);
      setSession(s);
    },
    []
  );

  // Clears session state and storage.
  const signOut = useCallback(() => {
    authService.signOut();
    setSession(null);
  }, []);

  // Small capability map for UI gating.
  const can = useMemo(
    () => ({
      create: authService.hasPermission(session, 'create_suggestions'),
      updateStatus: authService.hasPermission(session, 'update_status'),
      viewAll: authService.hasPermission(session, 'view_all'),
    }),
    [session]
  );

  return { session, signIn, signOut, can } as const;
};
