type BoardShellProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function BoardShell({
  title,
  children,
  className = "",
}: BoardShellProps) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-3xl border border-cyan-300/20",
        "bg-white/[0.04] backdrop-blur-xl",
        "shadow-[0_0_0_1px_rgba(125,211,252,0.06),0_0_40px_rgba(34,211,238,0.08)]",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_28%)]" />
      <div className="relative z-10 p-5 md:p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/80">
            {title}
          </h3>
        </div>
        {children}
      </div>
    </section>
  );
}
