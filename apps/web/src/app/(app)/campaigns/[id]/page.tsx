'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Zap, Sparkles, Globe, Target, MessageSquare, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useCampaign } from '@/hooks/use-campaigns'
import { useAdSets, useCreateGenerationJob } from '@/hooks/use-generation'
import { formatDate, getObjectiveLabel, getToneLabel, getPlatformLabel } from '@/lib/utils'
import { toast } from 'sonner'
import type { GenerationJob, Platform } from '@/types/api'

const platformVariants: Record<Platform, 'google' | 'meta' | 'tiktok'> = {
  GOOGLE: 'google',
  META: 'meta',
  TIKTOK: 'tiktok',
}

function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-slate-700">{value}</dd>
    </div>
  )
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string

  const { data: campaign, isLoading } = useCampaign(campaignId)
  const { data: adSets = [] } = useAdSets(campaignId)
  const createJob = useCreateGenerationJob()

  async function handleGenerate() {
    try {
      const job = await createJob.mutateAsync(campaignId)
      toast.success('Ad generation started!')
      const j = job as GenerationJob
      router.push(`/generated/${j.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start generation')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Campaign not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Created {formatDate(campaign.created_at)}
            </p>
          </div>
          <Button size="lg" onClick={handleGenerate} disabled={createJob.isPending}>
            <Zap className="h-4 w-4" />
            {createJob.isPending ? 'Starting...' : 'Generate Ads'}
          </Button>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-indigo-600" />
              Campaign Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Objective" value={getObjectiveLabel(campaign.objective)} />
              <InfoRow label="Tone of Voice" value={getToneLabel(campaign.tone)} />
              <InfoRow label="Budget Range" value={campaign.budget_range} />
              <InfoRow label="Offer" value={campaign.offer} />
            </dl>
            <Separator className="my-4" />
            <div>
              <dt className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                Platforms
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {campaign.platforms.map((p) => (
                  <Badge key={p} variant={platformVariants[p]}>
                    {getPlatformLabel(p)}
                  </Badge>
                ))}
              </dd>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-indigo-600" />
              Product Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="Website URL" value={campaign.website_url} />
              <InfoRow label="Country/Region" value={campaign.country_region} />
              <InfoRow label="Language" value={campaign.language} />
            </dl>
            {campaign.product_description && (
              <>
                <Separator className="my-4" />
                <div>
                  <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                    Product Description
                  </dt>
                  <dd className="text-sm text-slate-700">{campaign.product_description}</dd>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Creative Direction */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              Creative Direction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <InfoRow label="Landing Page Angle" value={campaign.landing_page_angle} />
              <InfoRow label="CTA Preference" value={campaign.cta_preference} />
              {campaign.special_notes && (
                <InfoRow label="Special Notes" value={campaign.special_notes} />
              )}
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Previous Ad Sets */}
      {adSets.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Generated Ad Sets ({adSets.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {adSets.map((adSet) => {
              const platforms = Object.keys(adSet.raw_json ?? {})
              return (
                <Link
                  key={adSet.id}
                  href={`/generated/${adSet.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Ad Set #{adSet.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(adSet.created_at)}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {platforms.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">
                        {getPlatformLabel(p.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
