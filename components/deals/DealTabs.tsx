'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Props = { dealId: string };

const tabs = [
  { label: 'Genel Bakış', href: '' },
  { label: 'Scope', href: '/scope' },
  { label: 'Milestones', href: '/milestones' },
  { label: 'Teslimler', href: '/deliveries' },
  { label: 'Revizyonlar', href: '/revisions' },
  { label: 'Escrow', href: '/escrow' },
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
