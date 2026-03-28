'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { CheckCircle, XCircle, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface Publisher {
  id: string
  company_name: string
  contact_email: string
  status: string
  revenue_share_pct: number
  rejection_reason?: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
  SUSPENDED: 'bg-slate-100 text-slate-600',
}

export default function AdminPublishersPage() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: publishers = [], isLoading } = useQuery({
    queryKey: ['admin-publishers', statusFilter],
    queryFn: () => {
      const url = statusFilter
        ? `/api/v1/admin/publishers?status_filter=${statusFilter}`
        : '/api/v1/admin/publishers'
      return apiClient.get<Publisher[]>(url)
    },
  })

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/v1/admin/publishers/${id}/approve`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-publishers'] }); toast.success('Publisher approved') },
    onError: (e: Error) => toast.error(e.message),
  })

  const rejectMutation = useMutation({
    mutationFn: (id: string) => apiClient.post(`/api/v1/admin/publishers/${id}/reject?reason=${encodeURIComponent('Does not meet publisher requirements')}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-publishers'] }); toast.success('Publisher rejected') },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publisher Management</h1>
          <p className="mt-1 text-sm text-slate-500">Review and approve publisher applications.</p>
        </div>
        <div className="flex gap-2">
          {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
            <Button key={s || 'all'} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)}>
              {s || 'All'}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : publishers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500">No publishers found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {publishers.map((pub) => (
            <Card key={pub.id}>
              <CardContent className="flex items-center justify-between p-4 gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{pub.company_name}</p>
                  <p className="text-sm text-slate-500">{pub.contact_email}</p>
                  {pub.rejection_reason && (
                    <p className="mt-1 text-xs text-red-600">Reason: {pub.rejection_reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[pub.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {pub.status}
                  </span>
                  <span className="text-xs text-slate-400">{pub.revenue_share_pct}% share</span>
                  {pub.status === 'PENDING' && (
                    <>
                      <Button size="sm" onClick={() => approveMutation.mutate(pub.id)} disabled={approveMutation.isPending}>
                        <CheckCircle className="h-3.5 w-3.5" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectMutation.mutate(pub.id)} disabled={rejectMutation.isPending}>
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
