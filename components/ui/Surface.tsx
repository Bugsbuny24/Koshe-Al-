export function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-subtitle">{description}</p> : null}
    </div>
  );
}
