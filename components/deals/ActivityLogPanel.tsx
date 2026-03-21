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
  milestones_created: "Milestone'lar oluşturuldu",
  milestone_updated: 'Milestone güncellendi',
  delivery_uploaded: 'Teslim eklendi',
  revision_requested: 'Revizyon oluşturuldu',
  milestone_approved: 'Onay kararı verildi',
  milestone_rejected: 'Revizyon talep edildi',
  escrow_linked: 'Escrow bağlandı',
  escrow_synced: 'Escrow durumu güncellendi',
};

function formatActivityTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins}dk önce`;
  if (diffHours < 24) return `${diffHours}sa önce`;
  if (diffDays < 7) return `${diffDays}g önce`;
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

export function ActivityLogPanel({ activity }: Props) {
  if (activity.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-slate-500 text-sm">Henüz aktivite yok.</p>
      </Card>
    );
  }
  return (
    <div className="space-y-1">
      {activity.map((log) => (
        <div key={log.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
          <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
            {eventIcons[log.event_type] || '📌'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-200">{eventLabels[log.event_type] || log.event_type}</p>
            {log.actor_type === 'user' && log.actor_id && (
              <p className="text-xs text-slate-600 font-mono mt-0.5">{log.actor_id.slice(0, 8)}…</p>
            )}
          </div>
          <span
            className="text-xs text-slate-500 flex-shrink-0 mt-0.5"
            title={new Date(log.created_at).toLocaleString('tr-TR')}
          >
            {formatActivityTime(log.created_at)}
          </span>
        </div>
      ))}
    </div>
  );
}
