import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

interface CourseCardProps {
  id: string;
  title: string;
  level: string;
  language: string;
  progress?: number;
  price?: number;
}

export function CourseCard({ id, title, level, language, progress = 0, price }: CourseCardProps) {
  return (
    <Link
      href={`/dashboard/learn/${id}`}
      className="block rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5 hover:bg-[#16161E] hover:border-[rgba(240,165,0,0.35)] transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant="gold">{level}</Badge>
        <span className="text-xs text-[#4A4845]">{language}</span>
      </div>
      <h3 className="font-semibold mb-3">{title}</h3>
      {price !== undefined && price > 0 && (
        <div className="mb-3 text-sm text-[#F0A500]">{price} Pi</div>
      )}
      <div className="w-full h-1.5 rounded-full bg-[rgba(240,165,0,0.1)]">
        <div className="h-full rounded-full bg-[#F0A500]" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-1 text-xs text-[#4A4845]">{progress}% tamamlandı</div>
    </Link>
  );
}
