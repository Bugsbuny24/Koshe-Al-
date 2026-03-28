'use client'

import { Globe, SlidersHorizontal, BarChart3, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Skeleton } from '@/components/ui/skeleton'

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  isLoading,
}: {
  title: string
  value: number | string
  icon: React.ElementType
  color: string
  isLoading?: boolean
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          {isLoading ? (
            <Skeleton className="mt-1 h-7 w-16" />
          ) : (
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function PublisherDashboardPage() {
  const { data: report, isLoading } = useQuery({
    queryKey: ['publisher-report'],
    queryFn: () => apiClient.get<{
      publisher_id: string
      slots: Array<{ slot_id: string; slot_name: string; impressions: number; clicks: number; ctr: number; earnings: number }>
      totals: { impressions: number; clicks: number; ctr: number; total_earnings: number }
    }>('/api/v1/reports/publisher').catch(() => null),
  })

  const totals = report?.totals
  const topSlots = (report?.slots ?? []).slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publisher Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor your ad inventory and earnings.</p>
        </div>
        <Button asChild>
          <Link href="/publisher/slots">
            <Plus className="h-4 w-4" />
            Add Slot
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Impressions" value={totals?.impressions ?? 0} icon={BarChart3} color="bg-blue-500" isLoading={isLoading} />
        <StatCard title="Total Clicks" value={totals?.clicks ?? 0} icon={TrendingUp} color="bg-indigo-500" isLoading={isLoading} />
        <StatCard title="CTR" value={`${totals?.ctr ?? 0}%`} icon={SlidersHorizontal} color="bg-violet-500" isLoading={isLoading} />
        <StatCard title="Total Earnings" value={`$${(totals?.total_earnings ?? 0).toFixed(2)}`} icon={Globe} color="bg-emerald-500" isLoading={isLoading} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top Ad Slots</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/publisher/reports">View full report</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          ) : topSlots.length === 0 ? (
            <div className="px-6 pb-6 text-center text-sm text-slate-500">
              No ad slots yet. <Link href="/publisher/slots" className="text-indigo-600 hover:underline">Create your first slot</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-5 gap-4 px-6 py-3 text-xs font-semibold uppercase text-slate-400">
                <span className="col-span-2">Slot</span>
                <span className="text-right">Impressions</span>
                <span className="text-right">Clicks</span>
                <span className="text-right">Earnings</span>
              </div>
              {topSlots.map((slot) => (
                <div key={slot.slot_id} className="grid grid-cols-5 gap-4 px-6 py-3 text-sm">
                  <span className="col-span-2 font-medium text-slate-900 truncate">{slot.slot_name}</span>
                  <span className="text-right text-slate-600">{slot.impressions.toLocaleString()}</span>
                  <span className="text-right text-slate-600">{slot.clicks.toLocaleString()}</span>
                  <span className="text-right font-medium text-emerald-600">${slot.earnings.toFixed(4)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
