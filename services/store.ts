import { Business, User } from '@/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface Store {
  theme: 'light' | 'dark'
  user: User | null
  business: Business | null
  token: string | null
  setUser: (user: User) => void
  setBusiness: (business: Business) => void
  setToken: (token: string) => void
  logout: () => void
  login: ({
    token,
    user,
    business,
  }: {
    token: string
    user: User
    business: Business
  }) => void
}
export const useStore = create<Store>()(
  persist(
    (set) => ({
      theme: 'light',
      user: null,
      business: null,
      token: null,
      setUser: (user: User) => set({ user }),
      setBusiness: (business: Business) => set({ business }),
      setToken: (token: string) => set({ token }),
      logout: () => set({ token: null, user: null, business: null }),
      login: ({ token, user, business }) =>
        set({ token: token, user, business }),
    }),
    {
      name: 'store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
