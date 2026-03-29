'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  Smartphone,
  Layout,
  SlidersHorizontal,
  BarChart3,
  Wallet,
  DollarSign,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Topbar } from '@/components/layout/topbar'

const navItems = [
  { href: '/publisher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/publisher/sites', label: 'Sites', icon: Globe },
  { href: '/publisher/apps', label: 'Apps', icon: Smartphone },
  { href: '/publisher/placements', label: 'Placements', icon: Layout },
  { href: '/publisher/slots', label: 'Ad Slots', icon: SlidersHorizontal },
  { href: '/publisher/reports', label: 'Reports', icon: BarChart3 },
  { href: '/publisher/earnings', label: 'Earnings', icon: DollarSign },
  { href: '/publisher/payouts', label: 'Payouts', icon: Wallet },
]

function PublisherSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-slate-900">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Link href="/publisher/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-white">AdGenius</span>
            <p className="text-xs text-emerald-400 leading-none">Publisher</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/publisher/dashboard'
                ? pathname === '/publisher/dashboard'
                : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800 px-3 py-3">
        <p className="px-3 text-xs text-slate-500">© 2024 AdGenius</p>
      </div>
    </aside>
  )
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <PublisherSidebar />
      <div className="flex flex-1 flex-col pl-60">
        <Topbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
