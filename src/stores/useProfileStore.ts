import { create } from 'zustand';

import type { IUser } from '@/types/users';

type IProfileStore = {
    accessToken: string;
    profile: IUser | null;
    setAccessToken: (token: string) => void;
    setProfile: (profile: IUser | null) => void;
    loginAsDemoUser: () => void;
    logout: () => void;
};

const demoUser: IUser = {
    id: 1,
    username: 'demo',
    email: 'demo@example.com',
    phone: '',
    website: '',
    language: 'en',
    imageUrl: '',
    roles: []
};

export const useProfileStore = create<IProfileStore>((set) => ({
    accessToken: '',
    profile: null,
    setAccessToken: (token) => set({ accessToken: token }),
    setProfile: (profile) => set({ profile }),
    loginAsDemoUser: () => set({ profile: demoUser, accessToken: 'demo-token' }),
    logout: () => set({ profile: null, accessToken: '' })
}));
