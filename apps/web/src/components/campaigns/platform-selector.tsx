'use client'

import { cn } from '@/lib/utils'
import type { Platform } from '@/types/api'

const PLATFORMS: { value: Platform; label: string; description: string; color: string }[] = [
  {
    value: 'GOOGLE',
    label: 'Google Ads',
    description: 'Search, Display & more',
    color: 'border-blue-200 bg-blue-50 text-blue-700 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-100',
  },
  {
    value: 'META',
    label: 'Meta Ads',
    description: 'Facebook & Instagram',
    color: 'border-indigo-200 bg-indigo-50 text-indigo-700 data-[selected=true]:border-indigo-500 data-[selected=true]:bg-indigo-100',
  },
  {
    value: 'TIKTOK',
    label: 'TikTok Ads',
    description: 'Short-form video',
    color: 'border-pink-200 bg-pink-50 text-pink-700 data-[selected=true]:border-pink-500 data-[selected=true]:bg-pink-100',
  },
]

interface PlatformSelectorProps {
  value: Platform[]
  onChange: (platforms: Platform[]) => void
}

export function PlatformSelector({ value, onChange }: PlatformSelectorProps) {
  function toggle(platform: Platform) {
    if (value.includes(platform)) {
      onChange(value.filter((p) => p !== platform))
    } else {
      onChange([...value, platform])
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      {PLATFORMS.map((p) => {
        const selected = value.includes(p.value)
        return (
          <button
            key={p.value}
            type="button"
            data-selected={selected}
            onClick={() => toggle(p.value)}
            className={cn(
              'flex flex-1 items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all',
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
                {p.label}
              </div>
              <div className="text-xs text-slate-500">{p.description}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
