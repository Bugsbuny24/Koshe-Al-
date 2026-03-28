'use client'

import { useState } from 'react'
import { Copy, Heart, Edit2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AdVariantCardProps {
  text: string
  label?: string
  isFavorite?: boolean
  onToggleFavorite?: () => void
  onEdit?: (newText: string) => void
  className?: string
}

export function AdVariantCard({
  text,
  label,
  isFavorite = false,
  onToggleFavorite,
  onEdit,
  className,
}: AdVariantCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(text)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSaveEdit() {
    if (editValue.trim() && onEdit) {
      onEdit(editValue.trim())
    }
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditValue(text)
    setIsEditing(false)
  }

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-slate-200 bg-white p-3 transition-shadow hover:shadow-sm',
        isFavorite && 'border-amber-200 bg-amber-50',
        className
      )}
    >
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
      )}

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            className="w-full resize-none rounded border border-slate-200 p-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-700 leading-relaxed">{text}</p>
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={handleCopy}
              title="Copy"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            {onToggleFavorite && (
              <Button
                size="icon"
                variant="ghost"
                className={cn('h-6 w-6', isFavorite && 'text-amber-500')}
                onClick={onToggleFavorite}
                title={isFavorite ? 'Unfavorite' : 'Favorite'}
              >
                <Heart className={cn('h-3 w-3', isFavorite && 'fill-current')} />
              </Button>
            )}
            {onEdit && (
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setIsEditing(true)}
                title="Edit"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
