'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AdSetViewer } from '@/components/generation/ad-set-viewer'
import { ExportMenu } from '@/components/generation/export-menu'
import { JobStatusPoller } from '@/components/generation/job-status-poller'
import { useAdSet, useGenerationJob } from '@/hooks/use-generation'
import { useCampaign } from '@/hooks/use-campaigns'
import { formatDate, getAdFormatLabel } from '@/lib/utils'

export default function GeneratedAdSetPage() {
  const params = useParams()
  const adSetId = params.id as string

  const { data: adSet, isLoading: adSetLoading } = useAdSet(adSetId)
  const { data: campaign, isLoading: campaignLoading } = useCampaign(
    adSet?.campaign_brief_id ?? ''
  )

  const adFormats = adSet ? (adSet.raw_json ? Object.keys(adSet.raw_json) : []) : []

  if (adSetLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (!adSet) {
    return (
      <div className="py-16 text-center">
        <Alert variant="destructive" className="mx-auto max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ad Set Not Found</AlertTitle>
          <AlertDescription>
            This ad set could not be found. It may have been deleted or the ID is incorrect.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" asChild>
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href={campaign ? `/campaigns/${campaign.id}` : '/campaigns'}>
            <ArrowLeft className="h-4 w-4" />
            {campaign ? `Back to ${campaign.name}` : 'Back to Campaigns'}
          </Link>
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Sparkles className="h-6 w-6 text-indigo-600" />
              Generated Ad Set
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Created {formatDate(adSet.created_at)}
            </p>
          </div>
          <ExportMenu adSet={adSet} />
        </div>
      </div>

      {/* Campaign Brief Summary */}
      {campaign && (
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4 p-4">
            <div>
              <p className="text-xs text-slate-400">Campaign</p>
              <Link
                href={`/campaigns/${campaign.id}`}
                className="text-sm font-medium text-slate-900 hover:text-indigo-600"
              >
                {campaign.name}
              </Link>
            </div>
            <div>
              <p className="text-xs text-slate-400">Ad Formats</p>
              <div className="flex gap-1">
                {adFormats.map((p) => (
                  <Badge key={p} variant="secondary" className="text-xs">
                    {getAdFormatLabel(p.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400">Objective</p>
              <p className="text-sm text-slate-700">{campaign.objective}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tone</p>
              <p className="text-sm text-slate-700">{campaign.tone}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ad Set Content */}
      <AdSetViewer adSet={adSet} />

      {/* Compliance Note */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-amber-800">Brand Safety & Compliance</p>
          <p className="mt-1 text-sm text-amber-700">
            Review all generated content before publishing. Ensure copy aligns with your platform
            policies and brand guidelines. AI-generated content should always be reviewed by a
            human before going live.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
