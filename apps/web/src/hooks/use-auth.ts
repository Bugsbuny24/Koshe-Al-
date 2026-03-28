'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/lib/api-client'
import type { User } from '@/types/api'

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        return await authApi.me<User>()
      } catch {
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return { user: user ?? null, isLoading, error, isAuthenticated: !!user }
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}
