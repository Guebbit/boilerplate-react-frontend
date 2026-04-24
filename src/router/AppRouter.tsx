import { Navigate, Route, Routes } from 'react-router-dom';

import { LayoutDefault } from '@/components/layout/LayoutDefault';
import { AdminPage } from '@/pages/core/AdminPage';
import { ErrorPage } from '@/pages/core/ErrorPage';
import { HomePage } from '@/pages/core/HomePage';
import { LoginPage } from '@/pages/account/LoginPage';
import { ProfilePage } from '@/pages/account/ProfilePage';
import { SignupPage } from '@/pages/account/SignupPage';
import { CartPage } from '@/pages/cart/CartPage';
import { OrderEditPage } from '@/pages/orders/OrderEditPage';
import { OrderPage } from '@/pages/orders/OrderPage';
import { OrdersListPage } from '@/pages/orders/OrdersListPage';
import { ProductEditPage } from '@/pages/products/ProductEditPage';
import { ProductPage } from '@/pages/products/ProductPage';
import { ProductsListPage } from '@/pages/products/ProductsListPage';
import { UserCreatePage } from '@/pages/users/UserCreatePage';
import { UserEditPage } from '@/pages/users/UserEditPage';
import { UserPage } from '@/pages/users/UserPage';
import { UsersListPage } from '@/pages/users/UsersListPage';

export const AppRouter = () => (
    <Routes>
        <Route element={<LayoutDefault />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/account/login' element={<LoginPage />} />
            <Route path='/account/signup' element={<SignupPage />} />
            <Route path='/account/profile' element={<ProfilePage />} />
            <Route path='/users' element={<UsersListPage />} />
            <Route path='/users/create' element={<UserCreatePage />} />
            <Route path='/users/:id' element={<UserPage />} />
            <Route path='/users/:id/edit' element={<UserEditPage />} />
            <Route path='/products' element={<ProductsListPage />} />
            <Route path='/products/:id' element={<ProductPage />} />
            <Route path='/products/:id/edit' element={<ProductEditPage />} />
            <Route path='/orders' element={<OrdersListPage />} />
            <Route path='/orders/:id' element={<OrderPage />} />
            <Route path='/orders/:id/edit' element={<OrderEditPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/admin' element={<AdminPage />} />
            <Route path='/error/:code?' element={<ErrorPage />} />
            <Route path='*' element={<Navigate to='/error/404' replace />} />
        </Route>
    </Routes>
);
