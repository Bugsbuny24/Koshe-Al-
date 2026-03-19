'use client';
import Link from 'next/link';

export function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[rgba(240,165,0,0.12)] bg-[#0C0C10] px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-xl">🪐</span>
        <span className="font-bold text-[#F0A500]">Koshei</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/profile"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(240,165,0,0.1)] text-sm hover:bg-[rgba(240,165,0,0.2)] transition-colors"
        >
          👤
        </Link>
      </div>
    </header>
  );
}
