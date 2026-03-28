'use client'

import { useQuery } from '@tanstack/react-query'
import { DollarSign, TrendingUp, BarChart3, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface FinanceOverview {
  total_invoiced: number
  total_budgets: number
  total_spent: number
  total_remaining: number
  platform_revenue_estimate: number
}

function MetricCard({ title, value, icon: Icon, color, description }: {
  title: string; value: string; icon: React.ElementType; color: string; description?: string
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
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminFinancePage() {
  const { data: finance, isLoading } = useQuery({
    queryKey: ['admin-finance'],
    queryFn: () => apiClient.get<FinanceOverview>('/api/v1/admin/finance'),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
      </div>
    )
  }

  const f = finance

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Finance Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Network-wide financial summary and revenue tracking.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Invoiced"
          value={`$${(f?.total_invoiced ?? 0).toFixed(2)}`}
          icon={DollarSign}
          color="bg-blue-500"
          description="Gross advertiser payments"
        />
        <MetricCard
          title="Ad Budgets Allocated"
          value={`$${(f?.total_budgets ?? 0).toFixed(2)}`}
          icon={BarChart3}
          color="bg-indigo-500"
          description="Total campaign budgets"
        />
        <MetricCard
          title="Total Spent"
          value={`$${(f?.total_spent ?? 0).toFixed(2)}`}
          icon={TrendingUp}
          color="bg-violet-500"
          description="Delivered spend across network"
        />
        <MetricCard
          title="Remaining Budgets"
          value={`$${(f?.total_remaining ?? 0).toFixed(2)}`}
          icon={DollarSign}
          color="bg-amber-500"
          description="Unspent campaign reserves"
        />
        <MetricCard
          title="Platform Revenue Est."
          value={`$${(f?.platform_revenue_estimate ?? 0).toFixed(2)}`}
          icon={PieChart}
          color="bg-emerald-500"
          description="~30% platform margin estimate"
        />
      </div>

      <Card>
        <CardHeader><CardTitle>V1 Finance Notes</CardTitle></CardHeader>
        <CardContent className="prose prose-sm text-slate-600">
          <ul className="space-y-2 list-disc pl-4">
            <li>Platform takes approximately 30% of ad spend; publishers earn ~70% revenue share.</li>
            <li>Advertiser invoices are manually issued in V1. Automated billing is planned for V2.</li>
            <li>Publisher payouts are processed monthly with a $25 minimum threshold.</li>
            <li>Full publisher payout ledger and individual payment records are in the Payouts section.</li>
            <li>Budget reservations, ledger entries, and spend transactions are tracked per campaign.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
