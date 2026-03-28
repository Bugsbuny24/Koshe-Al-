'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Brand } from '@/types/api'

const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().optional().default(''),
  website_url: z.string().url('Enter a valid URL').or(z.literal('')).optional().default(''),
})

type BrandFormData = z.infer<typeof brandSchema>

interface BrandFormProps {
  defaultValues?: Partial<Brand>
  onSubmit: (data: BrandFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function BrandForm({ defaultValues, onSubmit, onCancel, isLoading }: BrandFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      description: defaultValues?.description ?? '',
      website_url: defaultValues?.website_url ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Brand Name *</Label>
        <Input id="name" {...register('name')} placeholder="e.g. Acme Corp" />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="website_url">Website URL</Label>
        <Input
          id="website_url"
          {...register('website_url')}
          placeholder="https://example.com"
          type="url"
        />
        {errors.website_url && (
          <p className="text-xs text-red-500">{errors.website_url.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Brief description of your brand..."
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
          {isLoading ? 'Saving...' : 'Save Brand'}
        </Button>
      </div>
    </form>
  )
}
