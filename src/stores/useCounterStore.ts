import { create } from 'zustand';

type ICounterStore = {
    count: number;
    increment: () => void;
    decrement: () => void;
    setCount: (value: number) => void;
};

export const useCounterStore = create<ICounterStore>((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: Math.max(0, state.count - 1) })),
    setCount: (value) => set({ count: Math.max(0, value) })
}));
