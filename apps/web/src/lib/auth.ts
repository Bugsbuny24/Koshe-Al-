import { authApi } from './api-client'
import type { User } from '@/types/api'

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await authApi.me<User>()
  } catch {
    return null
  }
}

export function getAuthCookieName(): string {
  return 'session'
}
