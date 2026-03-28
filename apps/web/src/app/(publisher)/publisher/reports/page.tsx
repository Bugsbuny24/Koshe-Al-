'use client'

import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, DollarSign, MousePointerClick } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface SlotMetrics {
  slot_id: string
  slot_name: string
  impressions: number
  clicks: number
  ctr: number
  earnings: number
}

interface PublisherReport {
  publisher_id: string
  period: string
  slots: SlotMetrics[]
  totals: {
    impressions: number
    clicks: number
    ctr: number
    total_earnings: number
  }
}

function MetricCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ElementType; color: string }) {
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

export default function PublisherReportsPage() {
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['publisher-report'],
    queryFn: () => apiClient.get<PublisherReport>('/api/v1/reports/publisher'),
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

  if (error || !report) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-amber-800 font-medium">Publisher profile not found.</p>
        <p className="mt-1 text-sm text-amber-700">Create a publisher profile to view reports.</p>
      </div>
    )
  }

  const totals = report.totals

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Publisher Reports</h1>
        <p className="mt-1 text-sm text-slate-500">All-time performance across your ad inventory.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Impressions" value={totals.impressions.toLocaleString()} icon={BarChart3} color="bg-blue-500" />
        <MetricCard title="Total Clicks" value={totals.clicks.toLocaleString()} icon={MousePointerClick} color="bg-indigo-500" />
        <MetricCard title="Overall CTR" value={`${totals.ctr}%`} icon={TrendingUp} color="bg-violet-500" />
        <MetricCard title="Total Earnings" value={`$${totals.total_earnings.toFixed(2)}`} icon={DollarSign} color="bg-emerald-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance by Slot</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {report.slots.length === 0 ? (
            <div className="px-6 pb-6 pt-2 text-center text-sm text-slate-500">
              No ad slot data yet. Create placements and slots to start serving ads.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100">
                  <tr className="text-left">
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs">Slot</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-right">Impressions</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-right">Clicks</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-right">CTR</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 uppercase text-xs text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {report.slots.map((slot) => (
                    <tr key={slot.slot_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{slot.slot_name}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{slot.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{slot.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-slate-600">{slot.ctr}%</td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600">${slot.earnings.toFixed(4)}</td>
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
