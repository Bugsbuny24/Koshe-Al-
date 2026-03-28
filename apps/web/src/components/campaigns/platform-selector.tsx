'use client'

import { cn } from '@/lib/utils'
import type { AdFormat } from '@/types/api'

const AD_FORMATS: { value: AdFormat; label: string; description: string }[] = [
  {
    value: 'BANNER',
    label: 'Banner',
    description: 'Display banner ads (728×90, 300×250, etc.)',
  },
  {
    value: 'NATIVE_CARD',
    label: 'Native Card',
    description: 'In-feed native card placements',
  },
  {
    value: 'PROMOTED_LISTING',
    label: 'Promoted Listing',
    description: 'Sponsored product or service listings',
  },
  {
    value: 'FEED_CARD',
    label: 'Feed Card',
    description: 'Social-style feed card ads',
  },
  {
    value: 'VIDEO',
    label: 'Video',
    description: 'Pre-roll and in-stream video ads',
  },
]

interface AdFormatSelectorProps {
  value: AdFormat[]
  onChange: (formats: AdFormat[]) => void
}

export function AdFormatSelector({ value, onChange }: AdFormatSelectorProps) {
  function toggle(format: AdFormat) {
    if (value.includes(format)) {
      onChange(value.filter((f) => f !== format))
    } else {
      onChange([...value, format])
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {AD_FORMATS.map((f) => {
        const selected = value.includes(f.value)
        return (
          <button
            key={f.value}
            type="button"
            onClick={() => toggle(f.value)}
            className={cn(
              'flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all',
              selected
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <div
              className={cn(
                'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors',
                selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
              )}
            >
              {selected && (
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                </svg>
              )}
            </div>
            <div>
              <div className={cn('text-sm font-medium', selected ? 'text-indigo-900' : 'text-slate-900')}>
                {f.label}
              </div>
              <div className="text-xs text-slate-500">{f.description}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
