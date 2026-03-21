'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = { dealId: string };

const tabs = [
  { label: 'Genel Bakış', href: '', secondary: false },
  { label: 'Proje Kapsamı', href: '/scope', secondary: false },
  { label: 'Aşamalar', href: '/milestones', secondary: false },
  { label: 'Teslimler', href: '/deliveries', secondary: false },
  { label: 'Revizyonlar', href: '/revisions', secondary: false },
  { label: 'Ödeme (Escrow)', href: '/escrow', secondary: true },
];

export function DealTabs({ dealId }: Props) {
  const pathname = usePathname();
  const base = `/deals/${dealId}`;

  return (
    <div className="flex gap-1 border-b border-white/5 mb-6 overflow-x-auto">
      {tabs.map((tab) => {
        const href = `${base}${tab.href}`;
        const isActive = tab.href === '' ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              isActive
                ? 'border-accent-blue text-accent-blue'
                : tab.secondary
                ? 'border-transparent text-slate-600 hover:text-slate-400'
                : 'border-transparent text-slate-400 hover:text-white'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
