'use client'

import Link from 'next/link'
import { Package, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/empty-state'
import { useProducts } from '@/hooks/use-brands'
import { useBrands } from '@/hooks/use-brands'
import { formatDate } from '@/lib/utils'

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts()
  const { data: brands = [] } = useBrands()

  const brandMap = Object.fromEntries(brands.map((b) => [b.id, b.name]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          All products across your brands.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No products yet"
          description="Add products from a brand's detail page."
          action={
            <Button asChild>
              <Link href="/brands">Go to Brands</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{product.name}</CardTitle>
                  <Badge variant="secondary">{product.price_point}</Badge>
                </div>
                {brandMap[product.brand_id] && (
                  <Link
                    href={`/brands/${product.brand_id}`}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600"
                  >
                    <ExternalLink className="h-3 w-3" />
                    {brandMap[product.brand_id]}
                  </Link>
                )}
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-slate-500 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{product.category}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(product.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
