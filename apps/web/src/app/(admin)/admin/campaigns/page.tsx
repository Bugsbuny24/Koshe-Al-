'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Play, Pause, XCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface Campaign {
  id: string
  name: string
  status: string
  pricing_model: string
  total_budget: number
  spent_amount: number
  is_approved: boolean
  workspace_id: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  PENDING_APPROVAL: 'bg-amber-100 text-amber-700',
  PAUSED: 'bg-slate-100 text-slate-600',
  REJECTED: 'bg-red-100 text-red-700',
  EXHAUSTED: 'bg-blue-100 text-blue-700',
  ENDED: 'bg-slate-100 text-slate-500',
  APPROVED: 'bg-indigo-100 text-indigo-700',
  DRAFT: 'bg-slate-100 text-slate-500',
}

export default function AdminCampaignsPage() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['admin-campaigns', statusFilter],
    queryFn: () => {
      const url = statusFilter
        ? `/api/v1/admin/campaigns?status_filter=${statusFilter}`
        : '/api/v1/admin/campaigns'
      return apiClient.get<Campaign[]>(url)
    },
  })

  const activateMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/v1/admin/campaigns/${id}/activate`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-campaigns'] }); toast.success('Campaign activated') },
    onError: (e: Error) => toast.error(e.message),
  })

  const pauseMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/v1/admin/campaigns/${id}/pause`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-campaigns'] }); toast.success('Campaign paused') },
    onError: (e: Error) => toast.error(e.message),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      apiClient.post(`/api/v1/admin/campaigns/${id}/reject?reason=${encodeURIComponent(reason)}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-campaigns'] }); toast.success('Campaign rejected') },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaign Management</h1>
          <p className="mt-1 text-sm text-slate-500">Review, activate, and manage live campaigns.</p>
        </div>
        <div className="flex gap-2">
          {['', 'PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'REJECTED'].map(s => (
            <Button
              key={s || 'all'}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s || 'All'}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            No campaigns found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const remaining = c.total_budget - c.spent_amount
            const pct = c.total_budget > 0 ? (c.spent_amount / c.total_budget) * 100 : 0
            return (
              <Card key={c.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{c.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {c.pricing_model} · Budget: ${c.total_budget.toFixed(2)} · Spent: ${c.spent_amount.toFixed(2)} · Remaining: ${remaining.toFixed(2)}
                      </p>
                      <div className="mt-2 h-1.5 w-48 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[c.status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      {(c.status === 'PENDING_APPROVAL' || c.status === 'PAUSED' || c.status === 'APPROVED') && (
                        <Button size="sm" onClick={() => activateMutation.mutate(c.id)} disabled={activateMutation.isPending}>
                          <Play className="h-3.5 w-3.5" />
                          Activate
                        </Button>
                      )}
                      {c.status === 'ACTIVE' && (
                        <Button size="sm" variant="outline" onClick={() => pauseMutation.mutate(c.id)} disabled={pauseMutation.isPending}>
                          <Pause className="h-3.5 w-3.5" />
                          Pause
                        </Button>
                      )}
                      {c.status === 'PENDING_APPROVAL' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectMutation.mutate({ id: c.id, reason: 'Does not meet ad policies' })}
                          disabled={rejectMutation.isPending}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
