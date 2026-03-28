'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, DollarSign, MousePointerClick } from 'lucide-react'
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

interface AdvertiserReport {
  workspace_id: string
  period: string
  campaigns: CampaignMetrics[]
  totals: {
    impressions: number
    clicks: number
    ctr: number
    total_spend: number
    total_budget: number
    remaining_budget: number
  }
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  PAUSED: 'bg-slate-100 text-slate-600',
  EXHAUSTED: 'bg-blue-100 text-blue-700',
  ENDED: 'bg-slate-100 text-slate-400',
}

function MetricCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdvertiserReportsPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['advertiser-report'],
    queryFn: () => apiClient.get<AdvertiserReport>('/api/v1/reports/advertiser'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const t = report?.totals

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Campaign Reports</h1>
        <p className="mt-1 text-sm text-slate-500">All-time performance across your campaigns.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Impressions" value={(t?.impressions ?? 0).toLocaleString()} icon={BarChart3} color="bg-blue-500" />
        <MetricCard title="Total Clicks" value={(t?.clicks ?? 0).toLocaleString()} icon={MousePointerClick} color="bg-indigo-500" />
        <MetricCard title="CTR" value={`${t?.ctr ?? 0}%`} icon={TrendingUp} color="bg-violet-500" />
        <MetricCard title="Total Spend" value={`$${(t?.total_spend ?? 0).toFixed(2)}`} icon={DollarSign} color="bg-amber-500" />
      </div>

      <Card>
        <CardHeader><CardTitle>Campaign Breakdown</CardTitle></CardHeader>
        <CardContent className="p-0">
          {(report?.campaigns ?? []).length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-500">
              No campaigns found. <a href="/campaigns/new" className="text-indigo-600 hover:underline">Create your first campaign</a>
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
                  {report?.campaigns.map((c) => (
                    <tr key={c.campaign_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{c.campaign_name}</td>
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
