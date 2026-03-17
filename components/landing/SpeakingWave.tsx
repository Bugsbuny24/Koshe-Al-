export default function SpeakingWave() {
  return (
    <div className="flex h-10 items-end gap-[6px]">
      <span className="wave-bar h-3 w-2 rounded-full bg-cyan-400" />
      <span className="wave-bar wave-delay-1 h-6 w-2 rounded-full bg-sky-400" />
      <span className="wave-bar wave-delay-2 h-9 w-2 rounded-full bg-fuchsia-400" />
      <span className="wave-bar wave-delay-3 h-5 w-2 rounded-full bg-violet-400" />
      <span className="wave-bar wave-delay-4 h-7 w-2 rounded-full bg-cyan-300" />
    </div>
  );
}
