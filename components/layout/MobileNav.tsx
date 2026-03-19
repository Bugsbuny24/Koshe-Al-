'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Ana Sayfa' },
  { href: '/dashboard/learn', icon: '📚', label: 'Öğren' },
  { href: '/dashboard/build', icon: '🤖', label: 'Üret' },
  { href: '/dashboard/earn', icon: '💰', label: 'Kazan' },
  { href: '/dashboard/profile', icon: '👤', label: 'Profil' },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:hidden border-t border-[rgba(240,165,0,0.12)] bg-[#0C0C10]">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-colors',
              isActive ? 'text-[#F0A500]' : 'text-[#4A4845]'
            )}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
