'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

interface AdSlot {
  id: string
  placement_id: string
  name: string
  format: string
  width?: number
  height?: number
  category?: string
  is_active: boolean
}

interface Placement {
  id: string
  name: string
}

const slotSchema = z.object({
  placement_id: z.string().min(1, 'Placement is required'),
  name: z.string().min(1, 'Name is required'),
  format: z.enum(['BANNER', 'NATIVE_CARD', 'PROMOTED_LISTING', 'FEED_CARD']),
  width: z.string().optional(),
  height: z.string().optional(),
  category: z.string().optional(),
})
type SlotForm = z.infer<typeof slotSchema>

const FORMAT_LABELS: Record<string, string> = {
  BANNER: 'Banner',
  NATIVE_CARD: 'Native Card',
  PROMOTED_LISTING: 'Promoted Listing',
  FEED_CARD: 'Feed Card',
}

export default function PublisherSlotsPage() {
  const qc = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: placements = [] } = useQuery({
    queryKey: ['publisher-placements'],
    queryFn: () => apiClient.get<Placement[]>('/api/v1/publishers/placements'),
  })

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['publisher-slots'],
    queryFn: async () => {
      const allSlots: AdSlot[] = []
      for (const p of placements) {
        try {
          const s = await apiClient.get<AdSlot[]>(`/api/v1/publishers/placements/${p.id}/slots`)
          allSlots.push(...s)
        } catch {}
      }
      return allSlots
    },
    enabled: placements.length > 0,
  })

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SlotForm>({
    resolver: zodResolver(slotSchema),
    defaultValues: { format: 'BANNER' },
  })

  const createMutation = useMutation({
    mutationFn: (data: SlotForm) => apiClient.post(
      `/api/v1/publishers/placements/${data.placement_id}/slots`,
      {
        name: data.name,
        format: data.format,
        width: data.width ? parseInt(data.width) : undefined,
        height: data.height ? parseInt(data.height) : undefined,
        category: data.category || undefined,
      }
    ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['publisher-slots'] })
      toast.success('Ad slot created')
      reset()
      setIsDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ad Slots</h1>
          <p className="mt-1 text-sm text-slate-500">Manage ad slots across your placements.</p>
        </div>
        <Button onClick={() => { reset({ format: 'BANNER' }); setIsDialogOpen(true) }} disabled={placements.length === 0}>
          <Plus className="h-4 w-4" />
          Add Slot
        </Button>
      </div>

      {placements.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You need to create a placement before adding slots.{' '}
          <a href="/publisher/placements" className="font-medium underline">Create placements</a>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : slots.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <SlidersHorizontal className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500">No ad slots yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <Card key={slot.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <SlidersHorizontal className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{slot.name}</p>
                    <p className="text-sm text-slate-500">
                      {FORMAT_LABELS[slot.format] ?? slot.format}
                      {slot.width && slot.height && ` · ${slot.width}×${slot.height}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {slot.category && <Badge variant="outline">{slot.category}</Badge>}
                  <Badge variant={slot.is_active ? 'default' : 'secondary'}>
                    {slot.is_active ? 'Active' : 'Inactive'}
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
            <DialogTitle>Create Ad Slot</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Placement</Label>
              <Select onValueChange={(v) => setValue('placement_id', v)}>
                <SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
                <SelectContent>
                  {placements.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.placement_id && <p className="text-xs text-red-500">{errors.placement_id.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Slot Name</Label>
              <Input {...register('name')} placeholder="Homepage Banner 728x90" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Format</Label>
              <Select defaultValue="BANNER" onValueChange={(v) => setValue('format', v as SlotForm['format'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(FORMAT_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Width (px)</Label>
                <Input {...register('width')} placeholder="728" type="number" />
              </div>
              <div className="space-y-1.5">
                <Label>Height (px)</Label>
                <Input {...register('height')} placeholder="90" type="number" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Category (optional)</Label>
              <Input {...register('category')} placeholder="technology" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Slot'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
