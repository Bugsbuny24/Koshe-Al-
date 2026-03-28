'use client'

import { useCallback } from 'react'
import type { GeneratedAdSet } from '@/types/api'

type ExportFormat = 'json' | 'markdown' | 'text' | 'csv'

function exportAsJson(adSet: GeneratedAdSet): string {
  return JSON.stringify(adSet.raw_json, null, 2)
}

function exportAsMarkdown(adSet: GeneratedAdSet): string {
  const lines: string[] = ['# Generated Ad Set\n']
  const raw = adSet.raw_json as Record<string, unknown>

  for (const [platform, content] of Object.entries(raw)) {
    lines.push(`## ${platform.toUpperCase()}\n`)
    if (typeof content === 'object' && content !== null) {
      for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
        lines.push(`### ${key.replace(/_/g, ' ').toUpperCase()}\n`)
        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            if (typeof item === 'object') {
              lines.push(`${i + 1}. ${JSON.stringify(item)}`)
            } else {
              lines.push(`${i + 1}. ${String(item)}`)
            }
          })
        } else {
          lines.push(String(value))
        }
        lines.push('')
      }
    }
  }

  return lines.join('\n')
}

function exportAsText(adSet: GeneratedAdSet): string {
  const lines: string[] = ['GENERATED AD SET\n', '='.repeat(40) + '\n']
  const raw = adSet.raw_json as Record<string, unknown>

  for (const [platform, content] of Object.entries(raw)) {
    lines.push(`\n${platform.toUpperCase()}\n${'─'.repeat(20)}\n`)
    if (typeof content === 'object' && content !== null) {
      for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
        lines.push(`\n${key.replace(/_/g, ' ').toUpperCase()}:`)
        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            if (typeof item === 'object') {
              lines.push(`  ${i + 1}. ${JSON.stringify(item)}`)
            } else {
              lines.push(`  ${i + 1}. ${String(item)}`)
            }
          })
        } else {
          lines.push(`  ${String(value)}`)
        }
      }
    }
  }

  return lines.join('\n')
}

function exportAsCsv(adSet: GeneratedAdSet): string {
  const rows: string[][] = [['Platform', 'Type', 'Content']]
  const raw = adSet.raw_json as Record<string, unknown>

  for (const [platform, content] of Object.entries(raw)) {
    if (typeof content === 'object' && content !== null) {
      for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            const text = typeof item === 'object' ? JSON.stringify(item) : String(item)
            rows.push([platform, key, `"${text.replace(/"/g, '""')}"`])
          })
        } else {
          rows.push([platform, key, `"${String(value).replace(/"/g, '""')}"`])
        }
      }
    }
  }

  return rows.map((row) => row.join(',')).join('\n')
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function useExport(adSet: GeneratedAdSet | undefined) {
  const exportData = useCallback(
    (format: ExportFormat) => {
      if (!adSet) return

      const timestamp = new Date().toISOString().split('T')[0]
      const baseName = `adset-${adSet.id.slice(0, 8)}-${timestamp}`

      switch (format) {
        case 'json':
          downloadFile(exportAsJson(adSet), `${baseName}.json`, 'application/json')
          break
        case 'markdown':
          downloadFile(exportAsMarkdown(adSet), `${baseName}.md`, 'text/markdown')
          break
        case 'text':
          downloadFile(exportAsText(adSet), `${baseName}.txt`, 'text/plain')
          break
        case 'csv':
          downloadFile(exportAsCsv(adSet), `${baseName}.csv`, 'text/csv')
          break
      }
    },
    [adSet]
  )

  return { exportData }
}
