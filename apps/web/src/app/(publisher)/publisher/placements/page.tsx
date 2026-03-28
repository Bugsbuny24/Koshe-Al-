'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Layout } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface Placement {
  id: string
  name: string
  page_path?: string
  context_tags?: string[]
  is_active: boolean
  site_id?: string
  app_id?: string
}

const placementSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  page_path: z.string().optional(),
  context_tags: z.string().optional(),
})
type PlacementForm = z.infer<typeof placementSchema>

export default function PublisherPlacementsPage() {
  const qc = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: placements = [], isLoading } = useQuery({
    queryKey: ['publisher-placements'],
    queryFn: () => apiClient.get<Placement[]>('/api/v1/publishers/placements'),
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PlacementForm>({
    resolver: zodResolver(placementSchema),
  })

  const createMutation = useMutation({
    mutationFn: (data: PlacementForm) => apiClient.post('/api/v1/publishers/placements', {
      name: data.name,
      page_path: data.page_path || undefined,
      context_tags: data.context_tags ? data.context_tags.split(',').map(t => t.trim()) : undefined,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['publisher-placements'] })
      toast.success('Placement created')
      reset()
      setIsDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Placements</h1>
          <p className="mt-1 text-sm text-slate-500">Define ad placement contexts on your sites and apps.</p>
        </div>
        <Button onClick={() => { reset(); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4" />
          Add Placement
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : placements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Layout className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500">No placements yet. Add your first placement.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {placements.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <Layout className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{p.name}</p>
                    {p.page_path && <p className="text-sm text-slate-500">{p.page_path}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(p.context_tags ?? []).map(t => <Badge key={t} variant="outline">{t}</Badge>)}
                  <Badge variant={p.is_active ? 'default' : 'secondary'}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Placement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Placement Name</Label>
              <Input {...register('name')} placeholder="Homepage Above Fold" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Page Path (optional)</Label>
              <Input {...register('page_path')} placeholder="/about" />
            </div>
            <div className="space-y-1.5">
              <Label>Context Tags (comma-separated, optional)</Label>
              <Input {...register('context_tags')} placeholder="homepage, featured, sidebar" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
