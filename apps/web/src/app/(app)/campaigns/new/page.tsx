'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CampaignBriefForm } from '@/components/campaigns/campaign-brief-form'
import { useCreateCampaign } from '@/hooks/use-campaigns'
import { toast } from 'sonner'
import type { CampaignBrief } from '@/types/api'

export default function NewCampaignPage() {
  const router = useRouter()
  const createCampaign = useCreateCampaign()

  async function handleSubmit(data: Partial<CampaignBrief>) {
    try {
      const campaign = await createCampaign.mutateAsync(data)
      toast.success('Campaign brief saved!')
      const c = campaign as CampaignBrief
      router.push(`/campaigns/${c.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create campaign')
    }
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
        <h1 className="text-2xl font-bold text-slate-900">New Campaign Brief</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in your campaign details and we&apos;ll generate tailored ad copy for you.
        </p>
      </div>

      <CampaignBriefForm
        onSubmit={handleSubmit}
        isLoading={createCampaign.isPending}
      />
    </div>
  )
}
