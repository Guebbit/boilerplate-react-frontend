import type { RouteObject } from 'react-router-dom';

import { RequireAdmin } from '@/middlewares/authentication';
import { UserCreatePage } from '@/views/users/UserCreate';
import { UserEditPage } from '@/views/users/UserEdit';
import { UserPage } from '@/views/users/User';
import { UsersListPage } from '@/views/users/UsersList';

export const usersRoutes: RouteObject[] = [
  { path: 'users', element: <UsersListPage /> },
  { path: 'users/create', element: <RequireAdmin><UserCreatePage /></RequireAdmin> },
  { path: 'users/:id', element: <UserPage /> },
  { path: 'users/:id/edit', element: <RequireAdmin><UserEditPage /></RequireAdmin> }
];
