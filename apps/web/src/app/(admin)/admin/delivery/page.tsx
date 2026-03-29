'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BarChart3, TrendingUp, DollarSign, MousePointerClick, Radio, ShieldAlert } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

interface FraudSignal {
  id: string
  signal_type: string
  severity: number
  description: string | null
  signal_data: Record<string, unknown> | null
  campaign_id: string | null
  slot_id: string | null
  is_reviewed: boolean
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  PAUSED: 'bg-slate-100 text-slate-600',
  EXHAUSTED: 'bg-blue-100 text-blue-700',
}

function severityBadgeClass(severity: number): string {
  if (severity >= 8) return 'bg-red-100 text-red-700'
  if (severity >= 5) return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-600'
}

function signalTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    click_flood: 'Click Flood',
    orphan_click: 'Orphan Click',
    session_bomb: 'Session Bomb',
    ctr_anomaly: 'CTR Anomaly',
    ai_optimizer_pause: 'AI Pause',
  }
  return labels[type] ?? type
}

export default function AdminDeliveryPage() {
  const queryClient = useQueryClient()

  const { data: report, isLoading } = useQuery({
    queryKey: ['admin-report'],
    queryFn: () => apiClient.get<AdminReport>('/api/v1/reports/admin'),
  })

  const { data: fraudSignals, isLoading: fraudLoading } = useQuery({
    queryKey: ['fraud-signals'],
    queryFn: () => apiClient.get<FraudSignal[]>('/api/v1/admin/fraud/signals?hours=24&min_severity=1'),
    refetchInterval: 60_000, // auto-refresh every 60 seconds
  })

  const reviewMutation = useMutation({
    mutationFn: (signalId: string) =>
      apiClient.patch(`/api/v1/admin/fraud/signals/${signalId}/review`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraud-signals'] }),
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

      {/* Fraud Signals Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Fraud Signals
            <span className="ml-1 text-xs font-normal text-slate-400">(last 24h · auto-refreshes every 60s)</span>
          </CardTitle>
          {(fraudSignals ?? []).filter(s => !s.is_reviewed).length > 0 && (
            <Badge className="bg-red-500 text-white">
              {(fraudSignals ?? []).filter(s => !s.is_reviewed).length} unreviewed
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {fraudLoading ? (
            <div className="space-y-2 p-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (fraudSignals ?? []).length === 0 ? (
            <div className="px-6 pb-6 pt-2 text-center text-sm text-slate-500">
              <ShieldAlert className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              No fraud signals in the last 24 hours.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-400">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fraudSignals!.map((signal) => (
                    <tr key={signal.id} className={`transition-colors ${signal.is_reviewed ? 'opacity-50' : 'hover:bg-slate-50'}`}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {signalTypeLabel(signal.signal_type)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${severityBadgeClass(signal.severity)}`}>
                          {signal.severity}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-slate-600">
                        {signal.description ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {new Date(signal.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        {signal.is_reviewed ? (
                          <span className="text-xs text-slate-400">Reviewed</span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!signal.is_reviewed && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            disabled={reviewMutation.isPending}
                            onClick={() => reviewMutation.mutate(signal.id)}
                          >
                            Mark Reviewed
                          </Button>
                        )}
                      </td>
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
