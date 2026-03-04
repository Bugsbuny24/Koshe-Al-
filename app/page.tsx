import Shell from "@/components/Shell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card className="p-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Koshei AI — Dil Üniversitesi (V1)
          </h1>
          <p className="mt-3 text-white/70">
            Yazışma + konuşma pratiği + ders planı + progress. Üretim motoru yok — sadece öğretmen.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/dashboard">Dashboard</Button>
            <Button variant="secondary" href="/live">Live (Konuşma)</Button>
            <Button variant="secondary" href="/lesson">Ders</Button>
          </div>

          <div className="mt-8 text-sm text-white/50">
            Not: Gemini çağrısı server tarafında /api/chat üzerinden yapılır (API key client’a sızmaz).
          </div>
        </Card>
      </div>
    </Shell>
  );
}
