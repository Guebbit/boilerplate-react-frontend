import type { RouteObject } from 'react-router-dom';

import { CartPage } from '@/views/cart/Cart';

export const cartRoutes: RouteObject[] = [
  { path: 'cart', element: <CartPage /> }
];
