import { create } from 'zustand'
import { authApi } from '../services/api'
import { setToken, clearToken, isTokenValid } from '../utils/auth'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  login: async (email, password) => {
    const res = await authApi.login({ email, password })
    setToken(res.data.data.token)
    set({ user: res.data.data.user })
  },

  register: async (name, email, password) => {
    const res = await authApi.register({ name, email, password })
    setToken(res.data.data.token)
    set({ user: res.data.data.user })
  },

  logout: async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    clearToken()
    set({ user: null })
  },

  checkAuth: async () => {
    if (!isTokenValid()) {
      set({ isLoading: false })
      return
    }
    try {
      const res = await authApi.me()
      set({ user: res.data.data, isLoading: false })
    } catch {
      clearToken()
      set({ user: null, isLoading: false })
    }
  },
}))
