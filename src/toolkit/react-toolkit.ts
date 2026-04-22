import { create } from 'zustand';

export type ToastType = 'primary' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  visible: boolean;
}

interface CoreState {
  loadings: Record<string, boolean>;
  setLoading: (key?: string, value?: boolean) => boolean;
  getLoading: (key?: string) => boolean;
  resetLoadings: () => void;
}

interface NotificationsState {
  history: ToastMessage[];
  messages: () => ToastMessage[];
  addMessage: (message: string, type?: ToastType, timeout?: number) => void;
  hideMessage: (id: string) => void;
  removeMessage: (id: string) => void;
}

export const useCoreStore = create<CoreState>()((set, get) => ({
  loadings: {},
  setLoading: (key = '', value = false) => {
    set((state) => ({ loadings: { ...state.loadings, [key]: value } }));
    return value;
  },
  getLoading: (key = '') => Boolean(get().loadings[key]),
  resetLoadings: () => set({ loadings: {} })
}));

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  history: [],
  messages: () => get().history.filter((message) => message.visible),
  addMessage: (message, type = 'primary', timeout = -1) => {
    const id = crypto.randomUUID();
    set((state) => ({
      history: [...state.history, { id, message, type, visible: true }]
    }));

    if (timeout > 0) {
      setTimeout(() => {
        get().hideMessage(id);
      }, timeout);
    }
  },
  hideMessage: (id) =>
    set((state) => ({
      history: state.history.map((message) =>
        message.id === id ? { ...message, visible: false } : message
      )
    })),
  removeMessage: (id) =>
    set((state) => ({ history: state.history.filter((message) => message.id !== id) }))
}));

export const isCoreLoading = () =>
  Object.values(useCoreStore.getState().loadings).some(Boolean);
