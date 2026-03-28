import { DashboardShell } from '@/components/layout/publisher-shell'

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
