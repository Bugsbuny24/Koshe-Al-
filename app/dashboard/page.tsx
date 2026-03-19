import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0EDE6]">Dashboard</h1>
        <p className="text-[#8A8680]">Learn. Build. Earn.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Streak', value: '0 gün', icon: '🔥' },
          { label: 'Krediler', value: '100', icon: '⚡' },
          { label: 'Pi Bakiye', value: '0 Pi', icon: '🟣' },
          { label: 'Kurslar', value: '0', icon: '📚' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xl font-bold">{stat.value}</div>
            <div className="text-xs text-[#8A8680]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/dashboard/learn', icon: '📚', title: 'Öğren', desc: 'Kurs ve programlara göz at' },
          { href: '/dashboard/build', icon: '🤖', title: 'Üret', desc: 'AI ile uygulama oluştur' },
          { href: '/dashboard/earn', icon: '💰', title: 'Kazan', desc: 'Pi kazan ve harca' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5 hover:bg-[#16161E] hover:border-[rgba(240,165,0,0.35)] transition-all"
          >
            <div className="text-3xl mb-2">{action.icon}</div>
            <div className="font-semibold mb-1">{action.title}</div>
            <div className="text-sm text-[#8A8680]">{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
