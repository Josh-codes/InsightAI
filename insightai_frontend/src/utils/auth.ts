import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'insightai_token'

interface JwtPayload {
  user_id: number
  exp: number
}

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const isTokenValid = (): boolean => {
  const token = getToken()
  if (!token) return false
  try {
    const { exp } = jwtDecode<JwtPayload>(token)
    return Date.now() < exp * 1000
  } catch {
    return false
  }
}
