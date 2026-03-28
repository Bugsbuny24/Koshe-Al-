'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Product } from '@/types/api'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  price_point: z.string().min(1, 'Price point is required'),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  brandId: string
  defaultValues?: Partial<Product>
  onSubmit: (data: ProductFormData & { brand_id: string }) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ProductForm({
  brandId,
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      category: defaultValues?.category ?? '',
      price_point: defaultValues?.price_point ?? '',
    },
  })

  const handleFormSubmit = (data: ProductFormData) => {
    return onSubmit({ ...data, brand_id: brandId })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="product-name">Product Name *</Label>
        <Input id="product-name" {...register('name')} placeholder="e.g. Pro Plan" />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Category *</Label>
        <Input id="category" {...register('category')} placeholder="e.g. SaaS, E-commerce" />
        {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="price_point">Price Point *</Label>
        <Input
          id="price_point"
          {...register('price_point')}
          placeholder="e.g. $29/mo, Free, $99"
        />
        {errors.price_point && (
          <p className="text-xs text-red-500">{errors.price_point.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="product-description">Description *</Label>
        <Textarea
          id="product-description"
          {...register('description')}
          placeholder="Describe what this product does..."
          rows={3}
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  )
}
