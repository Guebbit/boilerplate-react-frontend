import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
}

interface ProductsState {
  items: Product[];
  fetchProducts: () => Promise<void>;
  findProduct: (id: string) => Product | undefined;
  updateProduct: (id: string, patch: Partial<Product>) => Promise<void>;
}

const initialProducts: Product[] = [
  { id: 'p-1', name: 'Keyboard', price: 99 },
  { id: 'p-2', name: 'Mouse', price: 49 }
];

export const useProductsStore = create<ProductsState>()((set, get) => ({
  items: [],
  fetchProducts: async () => {
    set({ items: initialProducts });
  },
  findProduct: (id) => get().items.find((item) => item.id === id),
  updateProduct: async (id, patch) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    }));
  }
}));
