'use client'

import { Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useExport } from '@/hooks/use-export'
import type { GeneratedAdSet } from '@/types/api'

interface ExportMenuProps {
  adSet: GeneratedAdSet | undefined
}

export function ExportMenu({ adSet }: ExportMenuProps) {
  const { exportData } = useExport(adSet)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={!adSet}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportData('json')}>
          JSON — Raw data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('markdown')}>
          Markdown — Formatted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('text')}>
          Text — Plain text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('csv')}>
          CSV — Spreadsheet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
