'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignsApi, audiencesApi } from '@/lib/api-client'
import type { CampaignBrief, Audience } from '@/types/api'

export function useCampaigns() {
  return useQuery<CampaignBrief[]>({
    queryKey: ['campaigns'],
    queryFn: () => campaignsApi.list<CampaignBrief[]>(),
  })
}

export function useCampaign(id: string) {
  return useQuery<CampaignBrief>({
    queryKey: ['campaigns', id],
    queryFn: () => campaignsApi.get<CampaignBrief>(id),
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CampaignBrief>) => campaignsApi.create<CampaignBrief>(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CampaignBrief> }) =>
      campaignsApi.update<CampaignBrief>(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
      queryClient.invalidateQueries({ queryKey: ['campaigns', id] })
    },
  })
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => campaignsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })
}

export function useAudiences() {
  return useQuery<Audience[]>({
    queryKey: ['audiences'],
    queryFn: () => audiencesApi.list<Audience[]>(),
  })
}

export function useAudience(id: string) {
  return useQuery<Audience>({
    queryKey: ['audiences', id],
    queryFn: () => audiencesApi.get<Audience>(id),
    enabled: !!id,
  })
}

export function useCreateAudience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Audience>) => audiencesApi.create<Audience>(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
    },
  })
}

export function useUpdateAudience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Audience> }) =>
      audiencesApi.update<Audience>(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
      queryClient.invalidateQueries({ queryKey: ['audiences', id] })
    },
  })
}

export function useDeleteAudience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => audiencesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audiences'] })
    },
  })
}
