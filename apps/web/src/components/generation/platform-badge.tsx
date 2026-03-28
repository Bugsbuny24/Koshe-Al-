import { cn } from '@/lib/utils'
import type { Platform } from '@/types/api'

const platformConfig: Record<Platform, { label: string; className: string }> = {
  GOOGLE: {
    label: 'Google Ads',
    className: 'bg-blue-100 text-blue-800 border border-blue-200',
  },
  META: {
    label: 'Meta Ads',
    className: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  },
  TIKTOK: {
    label: 'TikTok Ads',
    className: 'bg-pink-100 text-pink-800 border border-pink-200',
  },
}

interface PlatformBadgeProps {
  platform: Platform
  className?: string
}

export function PlatformBadge({ platform, className }: PlatformBadgeProps) {
  const config = platformConfig[platform]
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
