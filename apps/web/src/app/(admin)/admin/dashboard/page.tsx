'use client'

import { useQuery } from '@tanstack/react-query'
import { FileText, Users, BarChart3, DollarSign, Radio, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface NetworkOverview {
  total_campaigns: number
  active_campaigns: number
  pending_campaigns: number
  total_impressions: number
  total_clicks: number
  total_spend: number
  total_publishers: number
  approved_publishers: number
  pending_publishers: number
}

function StatCard({ title, value, icon: Icon, color, sub }: {
  title: string; value: number | string; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => apiClient.get<NetworkOverview>('/api/v1/admin/overview'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      </div>
    )
  }

  const ov = overview

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">AdGenius Network — operations overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Campaigns" value={ov?.active_campaigns ?? 0} icon={Radio} color="bg-emerald-500" sub={`${ov?.pending_campaigns ?? 0} pending approval`} />
        <StatCard title="Total Impressions" value={(ov?.total_impressions ?? 0).toLocaleString()} icon={BarChart3} color="bg-blue-500" />
        <StatCard title="Total Clicks" value={(ov?.total_clicks ?? 0).toLocaleString()} icon={FileText} color="bg-indigo-500" />
        <StatCard title="Network Spend" value={`$${(ov?.total_spend ?? 0).toFixed(2)}`} icon={DollarSign} color="bg-amber-500" />
        <StatCard title="Publishers" value={ov?.approved_publishers ?? 0} icon={Users} color="bg-violet-500" sub={`${ov?.pending_publishers ?? 0} pending approval`} />
        <StatCard title="Total Campaigns" value={ov?.total_campaigns ?? 0} icon={ShieldCheck} color="bg-rose-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/campaigns" className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
              <Radio className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Review pending campaigns</span>
              {(ov?.pending_campaigns ?? 0) > 0 && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {ov?.pending_campaigns}
                </span>
              )}
            </a>
            <a href="/admin/publishers" className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Review publisher applications</span>
              {(ov?.pending_publishers ?? 0) > 0 && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {ov?.pending_publishers}
                </span>
              )}
            </a>
            <a href="/admin/moderation" className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Moderation queue</span>
            </a>
            <a href="/admin/finance" className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium">Finance overview</span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Network Health</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Ad Serving</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">AI Generation</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Campaign Delivery</span>
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
