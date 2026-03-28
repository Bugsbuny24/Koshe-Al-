import { cn } from '@/lib/utils'
import type { AdFormat } from '@/types/api'

const formatConfig: Record<AdFormat, { label: string; className: string }> = {
  BANNER: {
    label: 'Banner',
    className: 'bg-blue-100 text-blue-800 border border-blue-200',
  },
  NATIVE_CARD: {
    label: 'Native Card',
    className: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  },
  PROMOTED_LISTING: {
    label: 'Promoted Listing',
    className: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  },
  FEED_CARD: {
    label: 'Feed Card',
    className: 'bg-amber-100 text-amber-800 border border-amber-200',
  },
  VIDEO: {
    label: 'Video',
    className: 'bg-rose-100 text-rose-800 border border-rose-200',
  },
}

interface FormatBadgeProps {
  format: AdFormat
  className?: string
}

export function FormatBadge({ format, className }: FormatBadgeProps) {
  const config = formatConfig[format] ?? { label: format, className: 'bg-slate-100 text-slate-800 border border-slate-200' }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
