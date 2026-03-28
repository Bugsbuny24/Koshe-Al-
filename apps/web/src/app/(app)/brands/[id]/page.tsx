'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Plus, Package, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { ProductForm } from '@/components/brands/product-form'
import { ConfirmDialog } from '@/components/common/confirm-dialog'
import { EmptyState } from '@/components/common/empty-state'
import { useBrand, useBrandProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-brands'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import type { Product } from '@/types/api'

export default function BrandDetailPage() {
  const params = useParams()
  const brandId = params.id as string

  const { data: brand, isLoading: brandLoading } = useBrand(brandId)
  const { data: products = [], isLoading: productsLoading } = useBrandProducts(brandId)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [addProductOpen, setAddProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  async function handleCreateProduct(data: Partial<Product> & { brand_id: string }) {
    try {
      await createProduct.mutateAsync(data)
      toast.success('Product added successfully')
      setAddProductOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add product')
    }
  }

  async function handleUpdateProduct(data: Partial<Product> & { brand_id: string }) {
    if (!editingProduct) return
    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, data })
      toast.success('Product updated')
      setEditingProduct(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update product')
    }
  }

  async function handleDeleteProduct() {
    if (!deletingProduct) return
    await deleteProduct.mutateAsync(deletingProduct.id)
    toast.success('Product deleted')
    setDeletingProduct(null)
  }

  if (brandLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Brand not found.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link href="/brands">Back to Brands</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/brands">
          <ArrowLeft className="h-4 w-4" />
          Back to Brands
        </Link>
      </Button>

      {/* Brand Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{brand.name}</h1>
              {brand.website_url && (
                <a
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {brand.website_url}
                </a>
              )}
              {brand.description && (
                <p className="mt-3 text-sm text-slate-500">{brand.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{products.length} products</Badge>
              <p className="text-xs text-slate-400">
                Created {formatDate(brand.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Products</h2>
          <Button size="sm" onClick={() => setAddProductOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        {productsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={<Package className="h-10 w-10" />}
            title="No products yet"
            description="Add products to this brand to use them in campaigns."
            action={
              <Button size="sm" onClick={() => setAddProductOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {products.map((product) => (
              <Card key={product.id} className="group">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-sm text-slate-500 line-clamp-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">{product.price_point}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Add a product to {brand.name}.</DialogDescription>
          </DialogHeader>
          <ProductForm
            brandId={brandId}
            onSubmit={handleCreateProduct}
            onCancel={() => setAddProductOpen(false)}
            isLoading={createProduct.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details.</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              brandId={brandId}
              defaultValues={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
              isLoading={updateProduct.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"?`}
        confirmLabel="Delete"
        onConfirm={handleDeleteProduct}
      />
    </div>
  )
}
