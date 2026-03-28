'use client'

import Link from 'next/link'
import { Eye, Trash2, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, getObjectiveLabel, getToneLabel, getPlatformLabel } from '@/lib/utils'
import type { CampaignBrief, Platform } from '@/types/api'

const platformVariants: Record<Platform, 'google' | 'meta' | 'tiktok'> = {
  GOOGLE: 'google',
  META: 'meta',
  TIKTOK: 'tiktok',
}

interface CampaignCardProps {
  campaign: CampaignBrief
  onDelete: (campaign: CampaignBrief) => void
  onGenerate: (campaign: CampaignBrief) => void
}

export function CampaignCard({ campaign, onDelete, onGenerate }: CampaignCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900">{campaign.name}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{formatDate(campaign.created_at)}</p>
          </div>
          <Badge variant="outline">{getObjectiveLabel(campaign.objective)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {campaign.platforms.map((platform) => (
            <Badge key={platform} variant={platformVariants[platform]}>
              {getPlatformLabel(platform)}
            </Badge>
          ))}
          <Badge variant="secondary">{getToneLabel(campaign.tone)}</Badge>
        </div>
        {campaign.product_description && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-500">
            {campaign.product_description}
          </p>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href={`/campaigns/${campaign.id}`}>
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={() => onGenerate(campaign)}
            className="flex-1"
          >
            <Zap className="h-3.5 w-3.5" />
            Generate
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(campaign)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
