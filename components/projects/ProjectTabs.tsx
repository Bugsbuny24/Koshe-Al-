'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { label: 'Overview', path: '' },
  { label: 'Brief', path: '/brief' },
  { label: 'Scope', path: '/scope' },
  { label: 'Drafts', path: '/drafts' },
  { label: 'Revisions', path: '/revisions' },
  { label: 'Delivery', path: '/delivery' },
];

interface ProjectTabsProps {
  projectId: string;
}

export function ProjectTabs({ projectId }: ProjectTabsProps) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;

  return (
    <div className="flex items-center gap-1 border-b border-white/5 mb-6 overflow-x-auto">
      {TABS.map((tab) => {
        const href = `${base}${tab.path}`;
        const isActive = tab.path === ''
          ? pathname === base
          : pathname.startsWith(href);
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 -mb-px',
              isActive
                ? 'border-accent-blue text-accent-blue'
                : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
