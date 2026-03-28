import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col pl-60">
        <Topbar />
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  )
}
