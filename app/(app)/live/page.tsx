import Shell from "@/components/Shell";
import LiveClient from "@/components/live/LiveClient";

export default function LivePage() {
  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold">Live — Konuşma Pratiği</h2>
          <p className="mt-1 text-white/60 text-sm">
            STT (tarayıcı) → /api/chat → (opsiyonel) /api/tts. V1’de konuşma sadece burada.
          </p>
          <div className="mt-6">
            <LiveClient />
          </div>
        </div>
      </div>
    </Shell>
  );
}
