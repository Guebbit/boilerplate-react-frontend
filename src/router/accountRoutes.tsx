import type { RouteObject } from 'react-router-dom';

import { RequireAuth, RequireGuest } from '@/middlewares/authentication';
import { LoginPage } from '@/views/account/Login';
import { ProfilePage } from '@/views/account/Profile';
import { SignupPage } from '@/views/account/Signup';

export const accountRoutes: RouteObject[] = [
  { path: 'account/login', element: <RequireGuest><LoginPage /></RequireGuest> },
  { path: 'account/signup', element: <RequireGuest><SignupPage /></RequireGuest> },
  { path: 'account/profile', element: <RequireAuth><ProfilePage /></RequireAuth> }
];
