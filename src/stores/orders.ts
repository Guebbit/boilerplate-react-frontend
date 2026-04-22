import { create } from 'zustand';

export interface Order {
  id: string;
  status: 'draft' | 'confirmed';
  total: number;
}

interface OrdersState {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  findOrder: (id: string) => Order | undefined;
  updateOrder: (id: string, patch: Partial<Order>) => Promise<void>;
}

const initialOrders: Order[] = [
  { id: 'o-1', status: 'confirmed', total: 149 },
  { id: 'o-2', status: 'draft', total: 79 }
];

export const useOrdersStore = create<OrdersState>()((set, get) => ({
  orders: [],
  fetchOrders: async () => {
    set({ orders: initialOrders });
  },
  findOrder: (id) => get().orders.find((order) => order.id === id),
  updateOrder: async (id, patch) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...patch } : order
      )
    }));
  }
}));
