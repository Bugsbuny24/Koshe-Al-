import { clsx } from "clsx";

interface LessonCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function LessonCard({ title, children, className }: LessonCardProps) {
  return (
    <div className={clsx("glass p-5", className)}>
      <h3 className="mb-3 text-base font-semibold tracking-tight">{title}</h3>
      <div className="text-sm text-white/80">{children}</div>
    </div>
  );
}
