'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, FileText, Zap, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { useCampaigns, useDeleteCampaign } from '@/hooks/use-campaigns'
import { useCreateGenerationJob } from '@/hooks/use-generation'
import { formatDate, getObjectiveLabel, getToneLabel, getPlatformLabel } from '@/lib/utils'
import { toast } from 'sonner'
import type { CampaignBrief, Platform } from '@/types/api'

const platformVariants: Record<Platform, 'google' | 'meta' | 'tiktok'> = {
  GOOGLE: 'google',
  META: 'meta',
  TIKTOK: 'tiktok',
}

export default function CampaignsPage() {
  const router = useRouter()
  const { data: campaigns = [], isLoading } = useCampaigns()
  const deleteCampaign = useDeleteCampaign()
  const createJob = useCreateGenerationJob()

  const [deletingCampaign, setDeletingCampaign] = useState<CampaignBrief | null>(null)

  async function handleDelete() {
    if (!deletingCampaign) return
    await deleteCampaign.mutateAsync(deletingCampaign.id)
    toast.success('Campaign deleted')
    setDeletingCampaign(null)
  }

  async function handleGenerate(campaign: CampaignBrief) {
    try {
      const job = await createJob.mutateAsync(campaign.id)
      toast.success('Generation started!')
      const j = job as { id: string }
      router.push(`/campaigns/${campaign.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start generation')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your campaign briefs.</p>
        </div>
        <Button asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title="No campaigns yet"
          description="Create your first campaign brief to start generating ad copy."
          action={
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="h-4 w-4" />
                Create Campaign
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 text-left">Campaign</th>
                  <th className="px-6 py-3 text-left">Platforms</th>
                  <th className="px-6 py-3 text-left">Objective</th>
                  <th className="px-6 py-3 text-left">Tone</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/campaigns/${campaign.id}`}
                        className="font-medium text-slate-900 hover:text-indigo-600"
                      >
                        {campaign.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {campaign.platforms.map((p) => (
                          <Badge key={p} variant={platformVariants[p]} className="text-xs">
                            {getPlatformLabel(p)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{getObjectiveLabel(campaign.objective)}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{getToneLabel(campaign.tone)}</td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {formatDate(campaign.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" asChild>
                          <Link href={`/campaigns/${campaign.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-indigo-600 hover:bg-indigo-50"
                          onClick={() => handleGenerate(campaign)}
                          disabled={createJob.isPending}
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setDeletingCampaign(campaign)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deletingCampaign}
        onOpenChange={(open) => !open && setDeletingCampaign(null)}
        title="Delete Campaign"
        description={`Delete "${deletingCampaign?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
