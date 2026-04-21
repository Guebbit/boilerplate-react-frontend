import { Navigate, useLocation } from 'react-router-dom';

import { useNotificationsStore } from '@/toolkit/react-toolkit';
import { useProfileStore } from '@/stores/profile';

export function RequireGuest({ children }: { children: React.ReactNode }) {
  const isAuth = useProfileStore((state) => state.isAuth());

  if (isAuth) {
    useNotificationsStore.getState().addMessage('You are already logged in', 'warning', 2500);
    return <Navigate to="/en" replace />;
  }

  return <>{children}</>;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuth = useProfileStore((state) => state.isAuth());
  const location = useLocation();

  if (!isAuth) {
    useNotificationsStore.getState().addMessage('Please login first', 'warning', 2500);
    return <Navigate to={`/en/account/login?continue=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const isAuth = useProfileStore((state) => state.isAuth());
  const isAdmin = useProfileStore((state) => state.isAdmin());

  if (!isAuth) {
    useNotificationsStore.getState().addMessage('Please login first', 'warning', 2500);
    return <Navigate to="/en/account/login" replace />;
  }

  if (!isAdmin) {
    useNotificationsStore.getState().addMessage('Admin access required', 'error', 2500);
    return <Navigate to="/en" replace />;
  }

  return <>{children}</>;
}
