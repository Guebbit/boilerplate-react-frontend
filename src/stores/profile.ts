import { create } from 'zustand';

export interface Profile {
  id: string;
  email: string;
  username: string;
  admin: boolean;
}

interface ProfileState {
  accessToken?: string;
  profile?: Profile;
  isAuth: () => boolean;
  isAdmin: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, username?: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const baseProfile = (email: string): Profile => ({
  id: email,
  email,
  username: email.split('@')[0] ?? email,
  admin: email.includes('admin')
});

export const useProfileStore = create<ProfileState>()((set, get) => ({
  accessToken: undefined,
  profile: undefined,
  isAuth: () => Boolean(get().accessToken && get().profile),
  isAdmin: () => Boolean(get().accessToken && get().profile?.admin),
  login: async (email, password) => {
    void password;
    set({ accessToken: `token-${email}`, profile: baseProfile(email) });
  },
  signup: async (email, password, username = email) => {
    void password;
    set({
      accessToken: `token-${email}`,
      profile: { ...baseProfile(email), username }
    });
  },
  refreshToken: async () => {
    if (get().profile && !get().accessToken) {
      set({ accessToken: `token-${get().profile?.email ?? 'guest'}` });
    }
  },
  fetchProfile: async () => {
    if (!get().profile && get().accessToken) {
      set({ profile: baseProfile('user@example.com') });
    }
  },
  logout: async () => {
    set({ accessToken: undefined, profile: undefined });
  }
}));
