import { create } from 'zustand';

import type { IProduct } from '@/types/products';

type ICartItem = IProduct & { quantity: number };

type ICartStore = {
    items: ICartItem[];
    addItem: (product: IProduct) => void;
    removeItem: (productId: number) => void;
    clear: () => void;
};

export const useCartStore = create<ICartStore>((set) => ({
    items: [],
    addItem: (product) =>
        set((state) => {
            const existingItem = state.items.find((item) => item.id === product.id);
            if (existingItem)
                return {
                    items: state.items.map((item) =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                };

            return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
    removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.id !== productId) })),
    clear: () => set({ items: [] })
}));
