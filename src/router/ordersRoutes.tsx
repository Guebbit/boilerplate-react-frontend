import type { RouteObject } from 'react-router-dom';

import { RequireAuth } from '@/middlewares/authentication';
import { OrderPage } from '@/views/orders/Order';
import { OrderEditPage } from '@/views/orders/OrderEdit';
import { OrdersListPage } from '@/views/orders/OrdersList';

export const ordersRoutes: RouteObject[] = [
  { path: 'orders', element: <RequireAuth><OrdersListPage /></RequireAuth> },
  { path: 'orders/:id', element: <RequireAuth><OrderPage /></RequireAuth> },
  { path: 'orders/:id/edit', element: <RequireAuth><OrderEditPage /></RequireAuth> }
];
