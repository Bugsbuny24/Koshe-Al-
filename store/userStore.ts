import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile, Wallet } from '@/types';

interface UserState {
  user: Profile | null;
  wallet: Wallet | null;
  setUser: (user: Profile | null) => void;
  setWallet: (wallet: Wallet | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      wallet: null,
      setUser: (user) => set({ user }),
      setWallet: (wallet) => set({ wallet }),
      clearUser: () => set({ user: null, wallet: null }),
    }),
    {
      name: 'koshei-user',
    }
  )
);
