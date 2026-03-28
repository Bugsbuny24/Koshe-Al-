'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth, useLogout } from '@/hooks/use-auth'

function getBreadcrumb(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return 'Dashboard'

  const labels: Record<string, string> = {
    dashboard: 'Dashboard',
    brands: 'Brands',
    products: 'Products',
    audiences: 'Audiences',
    campaigns: 'Campaigns',
    generated: 'Generated Ads',
    network: 'Ad Network',
    settings: 'Settings',
    new: 'New',
  }

  return segments
    .map((seg) => labels[seg] ?? (seg.length === 36 ? 'Detail' : seg))
    .join(' › ')
}

export function Topbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const logout = useLogout()

  const breadcrumb = getBreadcrumb(pathname)
  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white px-6">
      {/* Breadcrumb */}
      <div className="flex flex-1 items-center gap-2">
        <nav className="flex items-center gap-1 text-sm text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-900">
            AdGenius
          </Link>
          {breadcrumb !== 'Dashboard' && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-slate-900">{breadcrumb}</span>
            </>
          )}
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button size="sm" asChild>
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-medium">{user?.full_name ?? 'User'}</div>
              <div className="text-xs font-normal text-slate-500">{user?.email ?? ''}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onClick={() => logout.mutate()}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
