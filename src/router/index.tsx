import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { accountRoutes } from './accountRoutes';
import { cartRoutes } from './cartRoutes';
import { ordersRoutes } from './ordersRoutes';
import { productsRoutes } from './productsRoutes';
import { usersRoutes } from './usersRoutes';

import { RequireAdmin } from '@/middlewares/authentication';
import { getDefaultLocale } from '@/utils/locales';
import { AdminPage } from '@/views/core/Admin';
import { ErrorPage } from '@/views/core/Error';
import { HomePage } from '@/views/core/Home';
import { ReduxExamplePage } from '@/views/core/ReduxExample';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={`/${getDefaultLocale()}`} replace />
  },
  {
    path: '/:locale',
    element: <Outlet />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'admin', element: <RequireAdmin><AdminPage /></RequireAdmin> },
      ...accountRoutes,
      ...productsRoutes,
      ...usersRoutes,
      ...cartRoutes,
      ...ordersRoutes,
      { path: 'redux-example', element: <ReduxExamplePage /> },
      { path: 'error/:status/:message?', element: <ErrorPage /> },
      { path: '*', element: <Navigate to="error/404/not-found" replace /> }
    ]
  },
  {
    path: '*',
    element: <Navigate to={`/${getDefaultLocale()}/error/404/not-found`} replace />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
