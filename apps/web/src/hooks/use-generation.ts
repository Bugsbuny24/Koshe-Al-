'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { generationApi } from '@/lib/api-client'
import type { GenerationJob, GeneratedAdSet, GeneratedAdVariant } from '@/types/api'

export function useGenerationJob(jobId: string, enabled = true) {
  return useQuery<GenerationJob>({
    queryKey: ['jobs', jobId],
    queryFn: () => generationApi.getJob<GenerationJob>(jobId),
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      if (data.status === 'PENDING' || data.status === 'PROCESSING') {
        return 2000 // poll every 2 seconds
      }
      return false
    },
  })
}

export function useAdSet(adSetId: string) {
  return useQuery<GeneratedAdSet>({
    queryKey: ['ad-sets', adSetId],
    queryFn: () => generationApi.getAdSet<GeneratedAdSet>(adSetId),
    enabled: !!adSetId,
  })
}

export function useAdSets(campaignBriefId?: string) {
  return useQuery<GeneratedAdSet[]>({
    queryKey: ['ad-sets', { campaignBriefId }],
    queryFn: () => generationApi.listAdSets<GeneratedAdSet[]>(campaignBriefId),
  })
}

export function useCreateGenerationJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (campaignBriefId: string) =>
      generationApi.createJob<GenerationJob>(campaignBriefId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-sets'] })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ variantId, is_favorite }: { variantId: string; is_favorite: boolean }) =>
      generationApi.toggleFavorite<GeneratedAdVariant>(variantId, is_favorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-sets'] })
    },
  })
}

export function useUpdateVariant() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ variantId, content }: { variantId: string; content: Record<string, unknown> }) =>
      generationApi.updateVariant<GeneratedAdVariant>(variantId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ad-sets'] })
    },
  })
}
