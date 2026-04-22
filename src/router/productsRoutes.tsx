import type { RouteObject } from 'react-router-dom';

import { RequireAdmin } from '@/middlewares/authentication';
import { ProductEditPage } from '@/views/products/ProductEdit';
import { ProductPage } from '@/views/products/Product';
import { ProductsListPage } from '@/views/products/ProductsList';

export const productsRoutes: RouteObject[] = [
  { path: 'products', element: <ProductsListPage /> },
  { path: 'products/:id', element: <ProductPage /> },
  { path: 'products/:id/edit', element: <RequireAdmin><ProductEditPage /></RequireAdmin> }
];
