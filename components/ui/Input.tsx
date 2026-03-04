import { clsx } from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input(props: Props) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm",
        "outline-none focus:ring-2 focus:ring-white/20",
        props.className
      )}
    />
  );
}
