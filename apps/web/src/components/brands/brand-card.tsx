'use client'

import Link from 'next/link'
import { ExternalLink, Trash2, Edit, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Brand } from '@/types/api'

interface BrandCardProps {
  brand: Brand
  productCount?: number
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}

export function BrandCard({ brand, productCount = 0, onEdit, onDelete }: BrandCardProps) {
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900">{brand.name}</h3>
            {brand.website_url && (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-600"
              >
                <ExternalLink className="h-3 w-3" />
                {brand.website_url.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {productCount} {productCount === 1 ? 'product' : 'products'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {brand.description && (
          <p className="mb-4 line-clamp-2 text-sm text-slate-500">{brand.description}</p>
        )}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href={`/brands/${brand.id}`}>
              <Eye className="h-3.5 w-3.5" />
              View
            </Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(brand)}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(brand)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
