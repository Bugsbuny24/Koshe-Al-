import { ReactNode } from "react";

type BoardShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function BoardShell({
  title,
  subtitle,
  children,
}: BoardShellProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        ) : null}
      </div>

      <div>{children}</div>
    </section>
  );
}
