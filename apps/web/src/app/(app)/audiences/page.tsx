'use client'

import { useState } from 'react'
import { Plus, Users, Pencil, Trash2 } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { useAudiences, useCreateAudience, useUpdateAudience, useDeleteAudience } from '@/hooks/use-campaigns'
import { toast } from 'sonner'
import type { Audience } from '@/types/api'

const audienceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age_range: z.string().min(1, 'Age range is required'),
  gender: z.string().min(1, 'Gender is required'),
  interests: z.string(),
  locations: z.string(),
  languages: z.string(),
})

type AudienceFormData = z.infer<typeof audienceSchema>

function AudienceForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: {
  defaultValues?: Partial<Audience>
  onSubmit: (data: Partial<Audience>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AudienceFormData>({
    resolver: zodResolver(audienceSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      age_range: defaultValues?.age_range ?? '18-35',
      gender: defaultValues?.gender ?? 'All',
      interests: defaultValues?.interests?.join(', ') ?? '',
      locations: defaultValues?.locations?.join(', ') ?? '',
      languages: defaultValues?.languages?.join(', ') ?? 'English',
    },
  })

  async function handleFormSubmit(data: AudienceFormData) {
    await onSubmit({
      name: data.name,
      age_range: data.age_range,
      gender: data.gender,
      interests: data.interests.split(',').map((s) => s.trim()).filter(Boolean),
      locations: data.locations.split(',').map((s) => s.trim()).filter(Boolean),
      languages: data.languages.split(',').map((s) => s.trim()).filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Audience Name *</Label>
        <Input {...register('name')} placeholder="e.g. Young Professionals" />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Age Range *</Label>
          <Input {...register('age_range')} placeholder="e.g. 25-45" />
          {errors.age_range && <p className="text-xs text-red-500">{errors.age_range.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Gender *</Label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Interests (comma-separated)</Label>
        <Input {...register('interests')} placeholder="e.g. fitness, nutrition, wellness" />
      </div>
      <div className="space-y-1.5">
        <Label>Locations (comma-separated)</Label>
        <Input {...register('locations')} placeholder="e.g. United States, Canada" />
      </div>
      <div className="space-y-1.5">
        <Label>Languages (comma-separated)</Label>
        <Input {...register('languages')} placeholder="e.g. English, Spanish" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Audience'}
        </Button>
      </div>
    </form>
  )
}

export default function AudiencesPage() {
  const { data: audiences = [], isLoading } = useAudiences()
  const createAudience = useCreateAudience()
  const updateAudience = useUpdateAudience()
  const deleteAudience = useDeleteAudience()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingAudience, setEditingAudience] = useState<Audience | null>(null)
  const [deletingAudience, setDeletingAudience] = useState<Audience | null>(null)

  async function handleCreate(data: Partial<Audience>) {
    try {
      await createAudience.mutateAsync(data)
      toast.success('Audience created')
      setCreateOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create audience')
    }
  }

  async function handleUpdate(data: Partial<Audience>) {
    if (!editingAudience) return
    try {
      await updateAudience.mutateAsync({ id: editingAudience.id, data })
      toast.success('Audience updated')
      setEditingAudience(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update audience')
    }
  }

  async function handleDelete() {
    if (!deletingAudience) return
    await deleteAudience.mutateAsync(deletingAudience.id)
    toast.success('Audience deleted')
    setDeletingAudience(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audiences</h1>
          <p className="mt-1 text-sm text-slate-500">Define target audiences for your campaigns.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Audience
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : audiences.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="No audiences yet"
          description="Create target audiences to use in your campaign briefs."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Audience
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((audience) => (
            <Card key={audience.id} className="group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{audience.name}</CardTitle>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => setEditingAudience(audience)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => setDeletingAudience(audience)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary">{audience.age_range}</Badge>
                  <Badge variant="secondary">{audience.gender}</Badge>
                  {audience.locations.slice(0, 2).map((loc) => (
                    <Badge key={loc} variant="outline">
                      {loc}
                    </Badge>
                  ))}
                  {audience.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Audience</DialogTitle>
            <DialogDescription>Define a new target audience.</DialogDescription>
          </DialogHeader>
          <AudienceForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isLoading={createAudience.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAudience} onOpenChange={(open) => !open && setEditingAudience(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Audience</DialogTitle>
            <DialogDescription>Update audience details.</DialogDescription>
          </DialogHeader>
          {editingAudience && (
            <AudienceForm
              defaultValues={editingAudience}
              onSubmit={handleUpdate}
              onCancel={() => setEditingAudience(null)}
              isLoading={updateAudience.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deletingAudience}
        onOpenChange={(open) => !open && setDeletingAudience(null)}
        title="Delete Audience"
        description={`Delete "${deletingAudience?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
