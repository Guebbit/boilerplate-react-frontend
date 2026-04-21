import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  admin: boolean;
}

interface UsersState {
  items: User[];
  fetchUsers: () => Promise<void>;
  createUser: (email: string, admin?: boolean) => Promise<User>;
  updateUser: (id: string, patch: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const initialUsers: User[] = [
  { id: 'u-1', email: 'admin@example.com', admin: true },
  { id: 'u-2', email: 'user@example.com', admin: false }
];

export const useUsersStore = create<UsersState>()((set) => ({
  items: [],
  fetchUsers: async () => {
    set({ items: initialUsers });
  },
  createUser: async (email, admin = false) => {
    const user = { id: crypto.randomUUID(), email, admin };
    set((state) => ({ items: [...state.items, user] }));
    return user;
  },
  updateUser: async (id, patch) => {
    set((state) => ({
      items: state.items.map((user) => (user.id === id ? { ...user, ...patch } : user))
    }));
  },
  deleteUser: async (id) => {
    set((state) => ({ items: state.items.filter((user) => user.id !== id) }));
  }
}));
