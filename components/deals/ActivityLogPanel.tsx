import { Card } from '@/components/ui/Card';
import { DealActivityLog } from '@/types/deals';

type Props = { activity: DealActivityLog[] };

const eventIcons: Record<string, string> = {
  deal_created: '🎯',
  scope_locked: '🔒',
  milestones_created: '📋',
  milestone_updated: '✏️',
  delivery_uploaded: '📦',
  revision_requested: '🔄',
  milestone_approved: '✅',
  milestone_rejected: '❌',
  escrow_linked: '🔗',
  escrow_synced: '⚡',
};

const eventLabels: Record<string, string> = {
  deal_created: 'Deal oluşturuldu',
  scope_locked: 'Scope kilitlendi',
  milestones_created: 'Milestone planı oluşturuldu',
  milestone_updated: 'Milestone güncellendi',
  delivery_uploaded: 'Teslim yüklendi',
  revision_requested: 'Revizyon talep edildi',
  milestone_approved: 'Milestone onaylandı',
  milestone_rejected: 'Milestone reddedildi',
  escrow_linked: 'Escrow bağlandı',
  escrow_synced: 'Escrow senkronize edildi',
};

export function ActivityLogPanel({ activity }: Props) {
  if (activity.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-slate-500 text-sm">Henüz aktivite yok.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-2">
      {activity.map((log) => (
        <div key={log.id} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
          <span className="text-lg flex-shrink-0 mt-0.5">{eventIcons[log.event_type] || '📌'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300">{eventLabels[log.event_type] || log.event_type}</p>
            {log.actor_type === 'user' && log.actor_id && (
              <p className="text-xs text-slate-600 font-mono">{log.actor_id.slice(0, 8)}…</p>
            )}
          </div>
          <span className="text-xs text-slate-600 flex-shrink-0">
            {new Date(log.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })}
          </span>
        </div>
      ))}
    </div>
  );
}
