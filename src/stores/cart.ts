import { create } from 'zustand';

import { useProductsStore } from './products';

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  cartCount: () => number;
  fetchCart: () => Promise<void>;
  upsertCartItem: (productId: string, quantity: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  cartCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
  fetchCart: async () => {
    if (!useProductsStore.getState().items.length) {
      await useProductsStore.getState().fetchProducts();
    }
  },
  upsertCartItem: async (productId, quantity) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === productId);
      if (!existing) {
        return { items: [...state.items, { productId, quantity }] };
      }

      return {
        items: state.items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      };
    });
  },
  removeCartItem: async (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId)
    }));
  },
  clearCart: async () => {
    set({ items: [] });
  }
}));
