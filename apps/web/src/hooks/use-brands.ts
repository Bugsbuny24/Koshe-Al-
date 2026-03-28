'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { brandsApi, productsApi } from '@/lib/api-client'
import type { Brand, Product } from '@/types/api'

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () => brandsApi.list<Brand[]>(),
  })
}

export function useBrand(id: string) {
  return useQuery<Brand>({
    queryKey: ['brands', id],
    queryFn: () => brandsApi.get<Brand>(id),
    enabled: !!id,
  })
}

export function useCreateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Brand>) => brandsApi.create<Brand>(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
  })
}

export function useUpdateBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      brandsApi.update<Brand>(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      queryClient.invalidateQueries({ queryKey: ['brands', id] })
    },
  })
}

export function useDeleteBrand() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => brandsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] })
    },
  })
}

export function useBrandProducts(brandId: string) {
  return useQuery<Product[]>({
    queryKey: ['brands', brandId, 'products'],
    queryFn: () => productsApi.listByBrand<Product[]>(brandId),
    enabled: !!brandId,
  })
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productsApi.list<Product[]>(),
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Product>) => productsApi.create<Product>(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      if (data.brand_id) {
        queryClient.invalidateQueries({ queryKey: ['brands', data.brand_id, 'products'] })
      }
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productsApi.update<Product>(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
