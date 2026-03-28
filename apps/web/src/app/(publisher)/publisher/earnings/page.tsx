'use client'

import { useQuery } from '@tanstack/react-query'
import { DollarSign, MousePointerClick, Eye, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface Earning {
  id: string
  event_type: string
  amount: number
  slot_id: string
  campaign_id: string | null
  reference_id: string | null
  created_at: string
}

interface EarningsData {
  earnings: Earning[]
  totals: {
    total_earned: number
    impression_earnings: number
    click_earnings: number
    count: number
  }
}

const EVENT_LABELS: Record<string, string> = {
  impression: 'Impression',
  click: 'Click',
}

const EVENT_COLORS: Record<string, string> = {
  impression: 'bg-blue-50 text-blue-600',
  click: 'bg-emerald-50 text-emerald-600',
}

export default function PublisherEarningsPage() {
  const { data, isLoading } = useQuery<EarningsData>({
    queryKey: ['publisher-earnings'],
    queryFn: () => apiClient.get<EarningsData>('/api/v1/publisher/earnings'),
  })

  const totals = data?.totals
  const earnings = data?.earnings ?? []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publisher Earnings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track revenue earned from impressions and clicks across your ad slots.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Earned</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  ${totals?.total_earned?.toFixed(4) ?? '0.0000'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Impression Revenue</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  ${totals?.impression_earnings?.toFixed(4) ?? '0.0000'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
              <MousePointerClick className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Click Revenue</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">
                  ${totals?.click_earnings?.toFixed(4) ?? '0.0000'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Events</p>
              {isLoading ? (
                <Skeleton className="mt-1 h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold text-slate-900">{totals?.count ?? 0}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Earnings History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="divide-y">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : earnings.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No earnings yet. Earnings appear when ads are served to your slots.
            </div>
          ) : (
            <div className="divide-y">
              {earnings.map((earning) => (
                <div key={earning.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${EVENT_COLORS[earning.event_type] ?? ''}`}
                    >
                      {EVENT_LABELS[earning.event_type] ?? earning.event_type}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Slot: {earning.slot_id.slice(0, 8)}…
                      </p>
                      {earning.campaign_id && (
                        <p className="text-xs text-slate-400">
                          Campaign: {earning.campaign_id.slice(0, 8)}…
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-emerald-600">
                      +${earning.amount.toFixed(6)}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(earning.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
