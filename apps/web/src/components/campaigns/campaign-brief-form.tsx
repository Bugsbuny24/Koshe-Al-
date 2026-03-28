'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PlatformSelector } from './platform-selector'
import { useBrands, useProducts } from '@/hooks/use-brands'
import { useAudiences } from '@/hooks/use-campaigns'
import type { CampaignBrief, Platform, CampaignObjective, ToneOfVoice } from '@/types/api'

const campaignBriefSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  brand_id: z.string().uuid('Select a brand'),
  product_id: z.string().uuid().optional(),
  audience_id: z.string().uuid().optional(),
  product_description: z.string().min(10, 'Product description must be at least 10 characters'),
  website_url: z.string().url('Enter a valid URL'),
  country_region: z.string().min(1, 'Country/Region is required'),
  language: z.string().min(1, 'Language is required'),
  objective: z.enum(['TRAFFIC', 'LEADS', 'SALES', 'ENGAGEMENT', 'AWARENESS'] as const),
  tone: z.enum(['PROFESSIONAL', 'PREMIUM', 'CASUAL', 'AGGRESSIVE', 'EDUCATIONAL'] as const),
  platforms: z
    .array(z.enum(['GOOGLE', 'META', 'TIKTOK'] as const))
    .min(1, 'Select at least one platform'),
  offer: z.string().min(1, 'Offer is required'),
  budget_range: z.string().min(1, 'Budget range is required'),
  landing_page_angle: z.string().min(1, 'Landing page angle is required'),
  cta_preference: z.string().min(1, 'CTA preference is required'),
  special_notes: z.string().optional(),
})

type CampaignBriefFormData = z.infer<typeof campaignBriefSchema>

interface CampaignBriefFormProps {
  defaultValues?: Partial<CampaignBrief>
  onSubmit: (data: CampaignBriefFormData) => Promise<void>
  isLoading?: boolean
}

const OBJECTIVES: { value: CampaignObjective; label: string }[] = [
  { value: 'TRAFFIC', label: 'Traffic' },
  { value: 'LEADS', label: 'Leads' },
  { value: 'SALES', label: 'Sales' },
  { value: 'ENGAGEMENT', label: 'Engagement' },
  { value: 'AWARENESS', label: 'Awareness' },
]

const TONES: { value: ToneOfVoice; label: string }[] = [
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'CASUAL', label: 'Casual' },
  { value: 'AGGRESSIVE', label: 'Aggressive' },
  { value: 'EDUCATIONAL', label: 'Educational' },
]

export function CampaignBriefForm({ defaultValues, onSubmit, isLoading }: CampaignBriefFormProps) {
  const { data: brands = [] } = useBrands()
  const { data: products = [] } = useProducts()
  const { data: audiences = [] } = useAudiences()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CampaignBriefFormData>({
    resolver: zodResolver(campaignBriefSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      brand_id: defaultValues?.brand_id ?? undefined,
      product_id: defaultValues?.product_id ?? undefined,
      audience_id: defaultValues?.audience_id ?? undefined,
      product_description: defaultValues?.product_description ?? '',
      website_url: defaultValues?.website_url ?? '',
      country_region: defaultValues?.country_region ?? '',
      language: defaultValues?.language ?? 'English',
      objective: defaultValues?.objective ?? undefined,
      tone: defaultValues?.tone ?? undefined,
      platforms: (defaultValues?.platforms as Platform[]) ?? [],
      offer: defaultValues?.offer ?? '',
      budget_range: defaultValues?.budget_range ?? '',
      landing_page_angle: defaultValues?.landing_page_angle ?? '',
      cta_preference: defaultValues?.cta_preference ?? '',
      special_notes: defaultValues?.special_notes ?? '',
    },
  })

  const selectedBrandId = watch('brand_id')
  const filteredProducts = products.filter((p) => !selectedBrandId || p.brand_id === selectedBrandId)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Section 1: Basic Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="name">Campaign Name *</Label>
            <Input id="name" {...register('name')} placeholder="e.g. Q1 Lead Generation" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Brand *</Label>
            <Controller
              name="brand_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.brand_id && (
              <p className="text-xs text-red-500">{errors.brand_id.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Product (optional)</Label>
            <Controller
              name="product_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Target Audience (optional)</Label>
            <Controller
              name="audience_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {audiences.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Product Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Product Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="product_description">Product Description *</Label>
            <Textarea
              id="product_description"
              {...register('product_description')}
              placeholder="Describe your product or service in detail..."
              rows={4}
            />
            {errors.product_description && (
              <p className="text-xs text-red-500">{errors.product_description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="website_url">Website URL *</Label>
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
            <Label htmlFor="country_region">Country / Region *</Label>
            <Input
              id="country_region"
              {...register('country_region')}
              placeholder="e.g. United States"
            />
            {errors.country_region && (
              <p className="text-xs text-red-500">{errors.country_region.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              {...register('language')}
              placeholder="e.g. English"
            />
            {errors.language && (
              <p className="text-xs text-red-500">{errors.language.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Campaign Strategy */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Campaign Strategy</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Objective *</Label>
            <Controller
              name="objective"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select objective" />
                  </SelectTrigger>
                  <SelectContent>
                    {OBJECTIVES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.objective && (
              <p className="text-xs text-red-500">{errors.objective.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Tone of Voice *</Label>
            <Controller
              name="tone"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tone && <p className="text-xs text-red-500">{errors.tone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="offer">Offer *</Label>
            <Input
              id="offer"
              {...register('offer')}
              placeholder="e.g. 30% off, Free trial, Get a demo"
            />
            {errors.offer && <p className="text-xs text-red-500">{errors.offer.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="budget_range">Budget Range *</Label>
            <Input
              id="budget_range"
              {...register('budget_range')}
              placeholder="e.g. $500-$2000/month"
            />
            {errors.budget_range && (
              <p className="text-xs text-red-500">{errors.budget_range.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Platform & Creative */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-slate-900">Platform & Creative</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Platforms *</Label>
            <Controller
              name="platforms"
              control={control}
              render={({ field }) => (
                <PlatformSelector value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.platforms && (
              <p className="text-xs text-red-500">{errors.platforms.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="landing_page_angle">Landing Page Angle *</Label>
            <Textarea
              id="landing_page_angle"
              {...register('landing_page_angle')}
              placeholder="e.g. Focus on pain points of manual tracking, emphasize time savings..."
              rows={3}
            />
            {errors.landing_page_angle && (
              <p className="text-xs text-red-500">{errors.landing_page_angle.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cta_preference">CTA Preference *</Label>
            <Input
              id="cta_preference"
              {...register('cta_preference')}
              placeholder='e.g. "Start Free Trial", "Get Demo"'
            />
            {errors.cta_preference && (
              <p className="text-xs text-red-500">{errors.cta_preference.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="special_notes">Special Notes (optional)</Label>
            <Textarea
              id="special_notes"
              {...register('special_notes')}
              placeholder="Any additional instructions, brand guidelines, or restrictions..."
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading} className="min-w-[200px]">
          {isLoading ? 'Saving...' : 'Save Campaign Brief'}
        </Button>
      </div>
    </form>
  )
}
