'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, DollarSign, MousePointerClick, Radio } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface CampaignMetrics {
  campaign_id: string
  campaign_name: string
  status: string
  impressions: number
  clicks: number
  ctr: number
  total_budget: number
  spent_amount: number
  remaining_budget: number
  pricing_model: string
}

interface AdminReport {
  period: string
  total_impressions: number
  total_clicks: number
  overall_ctr: number
  total_spend: number
  top_campaigns: CampaignMetrics[]
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  PAUSED: 'bg-slate-100 text-slate-600',
  EXHAUSTED: 'bg-blue-100 text-blue-700',
}

export default function AdminDeliveryPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['admin-report'],
    queryFn: () => apiClient.get<AdminReport>('/api/v1/reports/admin'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const r = report

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Delivery Monitoring</h1>
        <p className="mt-1 text-sm text-slate-500">Real-time network delivery performance and campaign health.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Impressions</p>
              <p className="text-2xl font-bold text-slate-900">{(r?.total_impressions ?? 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500">
              <MousePointerClick className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Clicks</p>
              <p className="text-2xl font-bold text-slate-900">{(r?.total_clicks ?? 0).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Overall CTR</p>
              <p className="text-2xl font-bold text-slate-900">{r?.overall_ctr ?? 0}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Network Spend</p>
              <p className="text-2xl font-bold text-slate-900">${(r?.total_spend ?? 0).toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Campaigns by Spend</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(r?.top_campaigns ?? []).length === 0 ? (
            <div className="px-6 pb-6 pt-2 text-center text-sm text-slate-500">
              <Radio className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              No campaign data yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Campaign</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-400">Impressions</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-400">Clicks</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-400">CTR</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-400">Spend</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-400">Remaining</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {r?.top_campaigns.map((c) => (
                    <tr key={c.campaign_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 max-w-xs truncate">{c.campaign_name}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[c.status] ?? 'bg-slate-100 text-slate-600'}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-slate-600">{c.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{c.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{c.ctr}%</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900">${c.spent_amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right text-slate-600">${c.remaining_budget.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
