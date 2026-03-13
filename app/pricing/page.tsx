import PiPaymentButton from "@/components/PiPaymentButton";

const plans = [
  {
    title: "Free",
    price: "0₺",
    items: ["Günlük 20 konuşma sorusu", "Temel AI düzeltme", "Speaking score"],
  },
  {
    title: "İngilizce",
    price: "159₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
  {
    title: "Fransızca",
    price: "189₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
  {
    title: "Almanca",
    price: "219₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
  {
    title: "İtalyanca",
    price: "209₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
  {
    title: "İspanyolca",
    price: "229₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
  {
    title: "Çince",
    price: "319₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
  {
    title: "Japonca",
    price: "429₺",
    items: ["Sınırsız pratik", "AI correction", "Speaking history"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="rounded-[32px] border border-cyan-300/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Pricing
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Koshei Planları</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            İstediğin dil için premium aç. Pi Browser içindeysen Pi ile ödeme de hazır.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.title}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
              >
                <p className="text-sm font-semibold text-white">{plan.title}</p>
                <p className="mt-2 text-3xl font-semibold text-cyan-200">{plan.price}</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {plan.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>

                {plan.title !== "Free" ? (
                  <div className="mt-5">
                    <PiPaymentButton
                      amount={5}
                      memo={`${plan.title} premium`}
                      metadata={{
                        product: plan.title,
                        amount: 5,
                        description: `${plan.title} premium unlock`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
