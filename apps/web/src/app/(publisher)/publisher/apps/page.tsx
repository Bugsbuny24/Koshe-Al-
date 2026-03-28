'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Smartphone } from 'lucide-react'
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

interface App {
  id: string
  name: string
  bundle_id?: string
  platform: string
  category?: string
  is_active: boolean
}

const appSchema = z.object({
  name: z.string().min(1),
  bundle_id: z.string().optional(),
  platform: z.enum(['ios', 'android', 'web']),
  category: z.string().optional(),
  description: z.string().optional(),
})
type AppForm = z.infer<typeof appSchema>

export default function PublisherAppsPage() {
  const qc = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ['publisher-apps'],
    queryFn: () => apiClient.get<App[]>('/api/v1/publishers/apps'),
  })

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<AppForm>({
    resolver: zodResolver(appSchema),
    defaultValues: { platform: 'ios' },
  })

  const createMutation = useMutation({
    mutationFn: (data: AppForm) => apiClient.post('/api/v1/publishers/apps', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['publisher-apps'] })
      toast.success('App registered')
      reset({ platform: 'ios' })
      setIsDialogOpen(false)
    },
    onError: (err: Error) => toast.error(err.message),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Publisher Apps</h1>
          <p className="mt-1 text-sm text-slate-500">Register your mobile and web apps for in-app advertising.</p>
        </div>
        <Button onClick={() => { reset({ platform: 'ios' }); setIsDialogOpen(true) }}>
          <Plus className="h-4 w-4" />
          Add App
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Smartphone className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-slate-500">No apps registered. Add your first app.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <Card key={app.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Smartphone className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{app.name}</p>
                    {app.bundle_id && <p className="text-sm text-slate-500">{app.bundle_id}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{app.platform}</Badge>
                  {app.category && <Badge variant="outline">{app.category}</Badge>}
                  <Badge variant={app.is_active ? 'default' : 'secondary'}>
                    {app.is_active ? 'Active' : 'Inactive'}
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
            <DialogTitle>Register App</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="space-y-1.5">
              <Label>App Name</Label>
              <Input {...register('name')} placeholder="My Awesome App" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select defaultValue="ios" onValueChange={(v) => setValue('platform', v as AppForm['platform'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="web">Web App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Bundle ID / Package Name (optional)</Label>
              <Input {...register('bundle_id')} placeholder="com.example.myapp" />
            </div>
            <div className="space-y-1.5">
              <Label>Category (optional)</Label>
              <Input {...register('category')} placeholder="games, news, utility..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Registering...' : 'Register App'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
