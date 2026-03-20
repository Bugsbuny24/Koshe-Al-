'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useUserStore } from '@/store/userStore';

const BASE_NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/learn', icon: '📚', label: 'Öğren' },
  { href: '/dashboard/university', icon: '🎓', label: 'Üniversite' },
  { href: '/dashboard/build', icon: '🤖', label: 'Üret' },
  { href: '/dashboard/speak', icon: '🎙️', label: 'Konuş' },
  { href: '/dashboard/earn', icon: '💰', label: 'Kazan' },
  { href: '/dashboard/profile', icon: '👤', label: 'Profil' },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);

  const navItems =
    user?.role === 'admin'
      ? [
          ...BASE_NAV_ITEMS,
          { href: '/dashboard/admin/payouts', icon: '🧾', label: 'Payouts' },
        ]
      : BASE_NAV_ITEMS;

  return (
    <nav className="flex h-full w-64 flex-col border-r border-[rgba(240,165,0,0.12)] bg-[#0C0C10] px-4 py-6">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2">
        <span className="text-2xl">🪐</span>
        <span className="text-xl font-bold text-[#F0A500]">Koshei</span>
      </Link>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[rgba(240,165,0,0.1)] text-[#F0A500]'
                  : 'text-[#8A8680] hover:bg-[rgba(240,165,0,0.05)] hover:text-[#F0EDE6]'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-[rgba(240,165,0,0.12)] pt-4">
        <div className="rounded-xl bg-[rgba(240,165,0,0.05)] p-3">
          <div className="text-xs font-medium text-[#F0A500]">
            {user?.plan_id ? `${user.plan_id} plan` : 'Free Plan'}
          </div>
          <div className="mt-1 text-xs text-[#4A4845]">
            Learn. Build. Earn.
          </div>
        </div>
      </div>
    </nav>
  );
}
