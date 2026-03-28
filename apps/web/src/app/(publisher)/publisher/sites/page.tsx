'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Globe, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface Site {
  id: string
  name: string
  domain: string
  category?: string
  description?: string
  is_active: boolean
  created_at: string
}

const siteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domain: z.string().min(1, 'Domain is required'),
  category: z.string().optional(),
  description: z.string().optional(),
})
type SiteForm = z.infer<typeof siteSchema>

export default function PublisherSitesPage() {
  const qc = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editSite, setEditSite] = useState<Site | null>(null)

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['publisher-profile'],
    queryFn: () => apiClient.get<{ id: string; status: string; company_name: string }>('/api/v1/publishers/profile').catch(() => null),
  })

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ['publisher-sites'],
    queryFn: () => apiClient.get<Site[]>('/api/v1/publishers/sites'),
    enabled: !!profile,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SiteForm>({
    resolver: zodResolver(siteSchema),
  })

  const createMutation = useMutation({
    mutationFn: (data: SiteForm) => apiClient.post('/api/v1/publishers/sites', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['publisher-sites'] })
      toast.success('Site added successfully')
      reset()
      setIsDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/api/v1/publishers/sites/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['publisher-sites'] })
      toast.success('Site removed')
    },
    onError: (err: Error) => toast.error(err.message),
  })

  if (profileLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-64 w-full" /></div>
  }

  if (!profile) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Globe className="mx-auto mb-3 h-10 w-10 text-amber-500" />
        <h2 className="mb-1 font-semibold text-amber-900">Publisher profile required</h2>
        <p className="text-sm text-amber-700">You need a publisher profile before adding sites.</p>
        <Button className="mt-4" asChild>
          <a href="/publisher/settings">Create Profile</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publisher Sites</h1>
          <p className="mt-1 text-sm text-slate-500">Register your websites to serve ads.</p>
        </div>
        <Button onClick={() => { setEditSite(null); reset(); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4" />
          Add Site
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : sites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Globe className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500">No sites yet. Add your first website.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <Globe className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{site.name}</p>
                    <p className="text-sm text-slate-500">{site.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {site.category && <Badge variant="outline">{site.category}</Badge>}
                  <Badge variant={site.is_active ? 'default' : 'secondary'}>
                    {site.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(site.id)}
                  >
                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Site</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Site Name</Label>
              <Input {...register('name')} placeholder="My Tech Blog" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Domain</Label>
              <Input {...register('domain')} placeholder="techblog.example.com" />
              {errors.domain && <p className="text-xs text-red-500">{errors.domain.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Category (optional)</Label>
              <Input {...register('category')} placeholder="technology, finance, lifestyle..." />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input {...register('description')} placeholder="Brief description of your site" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Adding...' : 'Add Site'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
