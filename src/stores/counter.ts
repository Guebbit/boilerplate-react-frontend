import { create } from 'zustand';

interface CounterState {
  count: number;
  doubleCount: () => number;
  increment: () => void;
  incrementDelayed: () => Promise<number>;
  setCount: (value: number) => void;
}

export const useCounterStore = create<CounterState>()((set, get) => ({
  count: 0,
  doubleCount: () => get().count * 2,
  increment: () => set((state) => ({ count: state.count + 1 })),
  incrementDelayed: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set((state) => ({ count: state.count + 1 }));
    return get().count;
  },
  setCount: (value) => set({ count: value })
}));
