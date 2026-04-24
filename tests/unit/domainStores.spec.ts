import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useOrdersStore } from '@/stores/useOrdersStore';
import { useProductsStore } from '@/stores/useProductsStore';
import { useUsersStore } from '@/stores/useUsersStore';
import { ordersApi, productsApi, usersApi } from '@/utils/api';

describe('domain stores parity', () => {
    beforeEach(() => {
        useOrdersStore.setState({ orders: {}, ordersList: [], pageItemList: [], pageTotal: 0, loading: false });
        useProductsStore.setState({ products: {}, productsList: [], pageItemList: [], pageTotal: 0, loading: false });
        useUsersStore.setState({ users: {}, usersList: [], pageItemList: [], pageTotal: 0, loading: false });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('loads orders into useOrdersStore', async () => {
        vi.spyOn(ordersApi, 'listOrders').mockResolvedValue({
            data: {
                items: [
                    {
                        id: 'order-1',
                        userId: 'user-1',
                        email: 'demo@example.com',
                        items: [],
                        total: 75,
                        status: 'pending'
                    }
                ],
                meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }
            }
        } as never);

        await useOrdersStore.getState().fetchOrders();

        expect(useOrdersStore.getState().ordersList).toHaveLength(1);
        expect(useOrdersStore.getState().orders['order-1']?.status).toBe('pending');
    });

    it('loads products into useProductsStore', async () => {
        vi.spyOn(productsApi, 'listProducts').mockResolvedValue({
            data: {
                items: [{ id: 'product-1', title: 'Keyboard', price: 49 }],
                meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }
            }
        } as never);

        await useProductsStore.getState().fetchProducts();

        expect(useProductsStore.getState().productsList).toHaveLength(1);
        expect(useProductsStore.getState().products['product-1']?.title).toBe('Keyboard');
    });

    it('loads users into useUsersStore', async () => {
        vi.spyOn(usersApi, 'listUsers').mockResolvedValue({
            data: {
                items: [{ id: 'user-1', email: 'demo@example.com', username: 'demo' }],
                meta: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 }
            }
        } as never);

        await useUsersStore.getState().fetchUsers();

        expect(useUsersStore.getState().usersList).toHaveLength(1);
        expect(useUsersStore.getState().users['user-1']?.username).toBe('demo');
    });
});
