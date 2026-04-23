import { z } from 'zod';
import { create } from 'zustand';

import type { CheckoutRequest, CheckoutResponse, CreateOrderRequest, Order, SearchOrdersRequest, UpdateOrderByIdRequest } from '@api';
import { ordersApi } from '@/utils/api';
import { notifyError, notifySuccess, useCoreStore as getCoreStore, useStructureRestApi as getStructureRestApi } from '@/utils/reactToolkit';

type IOrdersFilters = Omit<SearchOrdersRequest, 'page' | 'pageSize'>;

type IOrdersStore = {
    orders: Record<string, Order>;
    ordersList: Order[];
    currentOrder: Order | null;
    selectedOrderId: string | null;
    loading: boolean;
    pageCurrent: number;
    pageSize: number;
    pageTotal: number;
    pageItemList: Order[];
    fetchOrders: (forced?: boolean) => Promise<Order[]>;
    fetchPaginationOrders: (page?: number, pageSize?: number, forced?: boolean) => Promise<Order[]>;
    fetchSearchOrders: (filters?: IOrdersFilters, page?: number, pageSize?: number, forced?: boolean) => Promise<Order[]>;
    fetchOrder: (orderId: string, forced?: boolean) => Promise<Order>;
    createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
    updateOrder: (orderId: string, orderData: UpdateOrderByIdRequest) => Promise<Order>;
    checkout: (checkoutData?: CheckoutRequest) => Promise<CheckoutResponse>;
    deleteOrder: (orderId: string) => Promise<void>;
    getOrderInvoice: (orderId: string) => Promise<File>;
    zodSchemaOrderStatus: z.ZodTypeAny;
    zodSchemaOrder: z.ZodTypeAny;
};

const getOrdersDictionary = (items: Order[]) => Object.fromEntries(items.map((item) => [item.id, item]));

const { getLoading, setLoading } = getCoreStore();
const restApi = getStructureRestApi();

const zodSchemaOrderStatus = z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']);
const zodSchemaOrder = z.object({
    id: z.string().nullish().optional(),
    userId: z.string().nullish().optional(),
    email: z.string().email().nullish().optional(),
    status: z.string().nullish().optional(),
    total: z.number().nullish().optional(),
    notes: z.string().nullish().optional(),
    createdAt: z.string().nullish().optional(),
    updatedAt: z.string().nullish().optional()
});

export const useOrdersStore = create<IOrdersStore>((set, get) => {
    const withLoading = async <T>(runner: () => Promise<T>) => {
        setLoading('orders', true);
        set({ loading: true });
        try {
            return await runner();
        } finally {
            setLoading('orders', false);
            set({ loading: false });
        }
    };

    return {
        orders: {},
        ordersList: [],
        currentOrder: null,
        selectedOrderId: null,
        loading: getLoading('orders'),
        pageCurrent: 1,
        pageSize: 10,
        pageTotal: 0,
        pageItemList: [],

        fetchOrders: async () =>
            withLoading(async () => {
                try {
                    const items = await restApi.fetchAll(() => ordersApi.listOrders().then(({ data }) => data.items ?? []));
                    set({ orders: getOrdersDictionary(items), ordersList: items, pageItemList: items, pageTotal: items.length });
                    return items;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        fetchPaginationOrders: async (page = 1, pageSize = 10) =>
            withLoading(async () => {
                try {
                    const response = await restApi.fetchAny(() => ordersApi.listOrders(page, pageSize).then(({ data }) => data));
                    set({
                        orders: { ...get().orders, ...getOrdersDictionary(response.items ?? []) },
                        ordersList: response.items ?? [],
                        pageItemList: response.items ?? [],
                        pageCurrent: page,
                        pageSize,
                        pageTotal: response.meta.totalItems
                    });
                    return response.items ?? [];
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        fetchSearchOrders: async (filters = {}, page = 1, pageSize = 10) =>
            withLoading(async () => {
                try {
                    const response = await restApi.fetchSearch(() =>
                        ordersApi.searchOrders({ ...filters, page, pageSize }).then(({ data }) => data)
                    );
                    set({
                        orders: { ...get().orders, ...getOrdersDictionary(response.items ?? []) },
                        ordersList: response.items ?? [],
                        pageItemList: response.items ?? [],
                        pageCurrent: page,
                        pageSize,
                        pageTotal: response.meta.totalItems
                    });
                    return response.items ?? [];
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        fetchOrder: async (orderId) =>
            withLoading(async () => {
                try {
                    const order = await restApi.fetchTarget(() => ordersApi.getOrderById(orderId).then(({ data }) => data));
                    set((state) => ({
                        orders: { ...state.orders, [order.id]: order },
                        currentOrder: order,
                        selectedOrderId: order.id
                    }));
                    return order;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        createOrder: async (orderData) =>
            withLoading(async () => {
                try {
                    const order = await restApi.createTarget(() => ordersApi.createOrder(orderData).then(({ data }) => data));
                    set((state) => ({
                        orders: { ...state.orders, [order.id]: order },
                        ordersList: [order, ...state.ordersList],
                        pageItemList: [order, ...state.pageItemList]
                    }));
                    notifySuccess('Order created');
                    return order;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        updateOrder: async (orderId, orderData) =>
            withLoading(async () => {
                try {
                    const order = await restApi.updateTarget(() =>
                        ordersApi.updateOrderById(orderId, orderData).then(({ data }) => data)
                    );
                    set((state) => ({
                        orders: { ...state.orders, [order.id]: order },
                        ordersList: state.ordersList.map((item) => (item.id === order.id ? order : item)),
                        pageItemList: state.pageItemList.map((item) => (item.id === order.id ? order : item)),
                        currentOrder: state.selectedOrderId === order.id ? order : state.currentOrder
                    }));
                    notifySuccess('Order updated');
                    return order;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        checkout: async (checkoutData) =>
            withLoading(async () => {
                try {
                    const response = await restApi.fetchAny(() => ordersApi.checkout(checkoutData).then(({ data }) => data));
                    notifySuccess('Checkout completed');
                    return response;
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        deleteOrder: async (orderId) =>
            withLoading(async () => {
                try {
                    await restApi.deleteTarget(() => ordersApi.deleteOrderById(orderId));
                    set((state) => {
                        const nextOrders = { ...state.orders };
                        delete nextOrders[orderId];
                        return {
                            orders: nextOrders,
                            ordersList: state.ordersList.filter((item) => item.id !== orderId),
                            pageItemList: state.pageItemList.filter((item) => item.id !== orderId),
                            currentOrder: state.currentOrder?.id === orderId ? null : state.currentOrder,
                            selectedOrderId: state.selectedOrderId === orderId ? null : state.selectedOrderId
                        };
                    });
                    notifySuccess('Order deleted');
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        getOrderInvoice: async (orderId) =>
            withLoading(async () => {
                try {
                    return await restApi.fetchAny(() =>
                        ordersApi.getOrderInvoice(orderId, { responseType: 'blob' }).then(({ data }) => data)
                    );
                } catch (error) {
                    notifyError((error as Error).message);
                    throw error;
                }
            }),

        zodSchemaOrderStatus,
        zodSchemaOrder
    };
});
