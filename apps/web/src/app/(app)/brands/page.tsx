'use client'

import { useState } from 'react'
import { Plus, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { BrandCard } from '@/components/brands/brand-card'
import { BrandForm } from '@/components/brands/brand-form'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { useBrands, useBrandProducts, useCreateBrand, useUpdateBrand, useDeleteBrand } from '@/hooks/use-brands'
import { toast } from 'sonner'
import type { Brand } from '@/types/api'

function BrandProductCount({ brandId }: { brandId: string }) {
  const { data: products = [] } = useBrandProducts(brandId)
  return <>{products.length}</>
}

export default function BrandsPage() {
  const { data: brands = [], isLoading } = useBrands()
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()
  const deleteBrand = useDeleteBrand()

  const [createOpen, setCreateOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null)

  async function handleCreate(data: Partial<Brand>) {
    try {
      await createBrand.mutateAsync(data)
      toast.success('Brand created successfully')
      setCreateOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create brand')
    }
  }

  async function handleUpdate(data: Partial<Brand>) {
    if (!editingBrand) return
    try {
      await updateBrand.mutateAsync({ id: editingBrand.id, data })
      toast.success('Brand updated successfully')
      setEditingBrand(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update brand')
    }
  }

  async function handleDelete() {
    if (!deletingBrand) return
    await deleteBrand.mutateAsync(deletingBrand.id)
    toast.success('Brand deleted')
    setDeletingBrand(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Brands</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your brands and their associated products.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Brand
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-12 w-12" />}
          title="No brands yet"
          description="Create your first brand to get started building campaigns."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Brand
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              productCount={0}
              onEdit={setEditingBrand}
              onDelete={setDeletingBrand}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Brand</DialogTitle>
            <DialogDescription>Add a new brand to your workspace.</DialogDescription>
          </DialogHeader>
          <BrandForm
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
            isLoading={createBrand.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingBrand} onOpenChange={(open) => !open && setEditingBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
            <DialogDescription>Update your brand details.</DialogDescription>
          </DialogHeader>
          {editingBrand && (
            <BrandForm
              defaultValues={editingBrand}
              onSubmit={handleUpdate}
              onCancel={() => setEditingBrand(null)}
              isLoading={updateBrand.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deletingBrand}
        onOpenChange={(open) => !open && setDeletingBrand(null)}
        title="Delete Brand"
        description={`Are you sure you want to delete "${deletingBrand?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </div>
  )
}
