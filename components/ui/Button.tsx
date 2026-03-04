import Link from "next/link";
import { clsx } from "clsx";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button({ children, href, onClick, variant="primary", type="button", disabled }: Props) {
  const className = clsx(
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
    "border border-white/10",
    variant === "primary"
      ? "bg-white text-black hover:bg-white/90"
      : "bg-white/5 text-white hover:bg-white/10",
    disabled && "opacity-50 pointer-events-none"
  );

  if (href) return <Link href={href} className={className}>{children}</Link>;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}
