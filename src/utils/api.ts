import { AccountApi, AuthApi, CartApi, OrdersApi, ProductsApi, UsersApi } from '@api';

import { Configuration } from '../../api';
import httpClient from '@/utils/http';

const apiConfiguration = new Configuration({
    basePath: import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
});

export const accountApi = new AccountApi(apiConfiguration, undefined, httpClient);
export const authApi = new AuthApi(apiConfiguration, undefined, httpClient);
export const cartApi = new CartApi(apiConfiguration, undefined, httpClient);
export const ordersApi = new OrdersApi(apiConfiguration, undefined, httpClient);
export const productsApi = new ProductsApi(apiConfiguration, undefined, httpClient);
export const usersApi = new UsersApi(apiConfiguration, undefined, httpClient);
