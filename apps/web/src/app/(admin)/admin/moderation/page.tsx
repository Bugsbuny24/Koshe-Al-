'use client'

import { useQuery } from '@tanstack/react-query'
import { ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'
import { formatDate } from '@/lib/utils'

interface ModerationItem {
  id: string
  item_type: string
  item_id: string
  decision: string
  notes?: string
  reviewed_at?: string
  created_at: string
}

const DECISION_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  NEEDS_REVISION: 'bg-blue-100 text-blue-700',
}

const TYPE_COLORS: Record<string, string> = {
  CAMPAIGN: 'bg-indigo-100 text-indigo-700',
  PUBLISHER: 'bg-violet-100 text-violet-700',
  CREATIVE: 'bg-orange-100 text-orange-700',
}

export default function AdminModerationPage() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['admin-moderation'],
    queryFn: () => apiClient.get<ModerationItem[]>('/api/v1/admin/moderation'),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Moderation Queue</h1>
        <p className="mt-1 text-sm text-slate-500">Review and track moderation decisions across the network.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500 font-medium">Queue is empty</p>
            <p className="mt-1 text-sm text-slate-400">All items have been reviewed. Great work!</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pending Review Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              <div className="grid grid-cols-5 gap-4 px-6 py-3 text-xs font-semibold uppercase text-slate-400">
                <span>Type</span>
                <span className="col-span-2">Item ID</span>
                <span>Decision</span>
                <span>Date</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-5 gap-4 items-center px-6 py-3 hover:bg-slate-50 transition-colors">
                  <span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TYPE_COLORS[item.item_type] ?? 'bg-slate-100 text-slate-600'}`}>
                      {item.item_type}
                    </span>
                  </span>
                  <span className="col-span-2 text-xs font-mono text-slate-500 truncate">{item.item_id}</span>
                  <span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${DECISION_COLORS[item.decision] ?? 'bg-slate-100 text-slate-600'}`}>
                      {item.decision}
                    </span>
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(item.created_at)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
