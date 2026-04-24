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
    fetchOrders: () => Promise<Order[]>;
    fetchPaginationOrders: (page?: number, pageSize?: number) => Promise<Order[]>;
    fetchSearchOrders: (filters?: IOrdersFilters, page?: number, pageSize?: number) => Promise<Order[]>;
    fetchOrder: (orderId: string) => Promise<Order>;
    createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
    updateOrder: (orderId: string, orderData: UpdateOrderByIdRequest) => Promise<Order>;
    checkout: (checkoutData?: CheckoutRequest) => Promise<CheckoutResponse>;
    deleteOrder: (orderId: string) => Promise<void>;
    getOrderInvoice: (orderId: string) => Promise<File>;
    zodSchemaOrderStatus: z.ZodTypeAny;
    zodSchemaOrder: z.ZodTypeAny;
};

const getOrdersDictionary = (items: Order[]) => Object.fromEntries(items.map((item) => [item.id, item]));

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

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error');

export const useOrdersStore = create<IOrdersStore>((set, get) => {
    const { getLoading, setLoading } = getCoreStore();
    const restApi = getStructureRestApi();

    /**
     * Wrap requests with loading state handling
     *
     * @param runner
     */
    const withLoading = <T>(runner: () => Promise<T>) => {
        setLoading('orders', true);
        set({ loading: true });

        return runner().finally(() => {
            setLoading('orders', false);
            set({ loading: false });
        });
    };

    /**
     * Notify errors but keep rejection behavior
     *
     * @param request
     */
    const withNotifiedErrors = <T>(request: Promise<T>) =>
        request.catch((error: unknown) => {
            notifyError(getErrorMessage(error));
            return Promise.reject(error);
        });

    /**
     * Fetch all orders for the authenticated user
     *
     */
    const fetchOrders = () =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.fetchAll(() => ordersApi.listOrders().then(({ data }) => data.items ?? [])).then((items) => {
                    set({ orders: getOrdersDictionary(items), ordersList: items, pageItemList: items, pageTotal: items.length });
                    return items;
                })
            )
        );

    /**
     * @param page
     * @param pageSize
     */
    const fetchPaginationOrders = (page = 1, pageSize = 10) =>
        withNotifiedErrors(
            withLoading(() => {
                return restApi.fetchAny(() => ordersApi.listOrders(page, pageSize).then(({ data }) => data)).then((response) => {
                    set({
                        orders: { ...get().orders, ...getOrdersDictionary(response.items ?? []) },
                        ordersList: response.items ?? [],
                        pageItemList: response.items ?? [],
                        pageCurrent: page,
                        pageSize,
                        pageTotal: response.meta.totalItems
                    });
                    return response.items ?? [];
                });
            })
        );

    /**
     * @param filters
     * @param page
     * @param pageSize
     */
    const fetchSearchOrders = (filters: IOrdersFilters = {}, page = 1, pageSize = 10) =>
        withNotifiedErrors(
            withLoading(() => {
                return restApi
                    .fetchSearch(() => ordersApi.searchOrders({ ...filters, page, pageSize }).then(({ data }) => data))
                    .then((response) => {
                        set({
                            orders: { ...get().orders, ...getOrdersDictionary(response.items ?? []) },
                            ordersList: response.items ?? [],
                            pageItemList: response.items ?? [],
                            pageCurrent: page,
                            pageSize,
                            pageTotal: response.meta.totalItems
                        });
                        return response.items ?? [];
                    });
            })
        );

    /**
     * Fetch a single order by ID
     *
     * @param orderId
     */
    const fetchOrder = (orderId: string) =>
        withNotifiedErrors(
            withLoading(() => {
                return restApi.fetchTarget(() => ordersApi.getOrderById(orderId).then(({ data }) => data)).then((order) => {
                    set((state) => ({
                        orders: { ...state.orders, [order.id]: order },
                        currentOrder: order,
                        selectedOrderId: order.id
                    }));
                    return order;
                });
            })
        );

    /**
     * Create a new order directly (admin)
     *
     * @param orderData
     */
    const createOrder = (orderData: CreateOrderRequest) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.createTarget(() => ordersApi.createOrder(orderData).then(({ data }) => data)).then((order) => {
                    set((state) => ({
                        orders: { ...state.orders, [order.id]: order },
                        ordersList: [order, ...state.ordersList],
                        pageItemList: [order, ...state.pageItemList]
                    }));
                    notifySuccess('Order created');
                    return order;
                })
            )
        );

    /**
     * Update an existing order by ID
     *
     * @param orderId
     * @param orderData
     */
    const updateOrder = (orderId: string, orderData: UpdateOrderByIdRequest) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi
                    .updateTarget(() => ordersApi.updateOrderById(orderId, orderData).then(({ data }) => data))
                    .then((order) => {
                        set((state) => ({
                            orders: { ...state.orders, [order.id]: order },
                            ordersList: state.ordersList.map((item) => (item.id === order.id ? order : item)),
                            pageItemList: state.pageItemList.map((item) => (item.id === order.id ? order : item)),
                            currentOrder: state.selectedOrderId === order.id ? order : state.currentOrder
                        }));
                        notifySuccess('Order updated');
                        return order;
                    })
            )
        );

    /**
     * Convert the authenticated user's current cart into a new order
     *
     * @param checkoutData
     */
    const checkout = (checkoutData?: CheckoutRequest) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.fetchAny(() => ordersApi.checkout(checkoutData).then(({ data }) => data)).then((response) => {
                    notifySuccess('Checkout completed');
                    return response;
                })
            )
        );

    /**
     * Delete an order by ID
     *
     * @param orderId
     */
    const deleteOrder = (orderId: string) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.deleteTarget(() => ordersApi.deleteOrderById(orderId)).then(() => {
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
                })
            )
        );

    /**
     * Download order invoice (PDF binary)
     *
     * @param orderId
     */
    const getOrderInvoice = (orderId: string) =>
        withNotifiedErrors(
            withLoading(() =>
                restApi.fetchAny(() =>
                    ordersApi.getOrderInvoice(orderId, { responseType: 'blob' }).then(({ data }) => data)
                )
            )
        );

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

        fetchOrders,
        fetchPaginationOrders,
        fetchSearchOrders,
        fetchOrder,
        createOrder,
        updateOrder,
        checkout,
        deleteOrder,
        getOrderInvoice,

        zodSchemaOrderStatus,
        zodSchemaOrder
    };
});
