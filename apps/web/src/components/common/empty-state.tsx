import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center',
        className
      )}
    >
      {icon && <div className="mb-4 text-slate-400">{icon}</div>}
      <h3 className="mb-1 text-base font-semibold text-slate-900">{title}</h3>
      {description && <p className="mb-4 text-sm text-slate-500">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
