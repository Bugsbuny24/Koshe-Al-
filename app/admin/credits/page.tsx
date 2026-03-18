"use client";

import { useState } from "react";

type RecentLoad = {
  userId: string;
  amount: number;
  description: string;
  newBalance: number;
  loadedAt: string;
};

export default function AdminCreditsPage() {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [successText, setSuccessText] = useState("");
  const [recentLoads, setRecentLoads] = useState<RecentLoad[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorText("");
    setSuccessText("");

    const parsedAmount = parseInt(amount, 10);
    if (!userId.trim()) {
      setErrorText("Kullanıcı ID boş olamaz.");
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorText("Geçerli bir kredi miktarı girin.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId.trim(),
          amount: parsedAmount,
          description: description.trim() || "Admin manuel yükleme",
        }),
      });

      const json = (await res.json()) as {
        success?: boolean;
        newBalance?: number;
        error?: string;
      };

      if (!res.ok || !json.success) {
        setErrorText(json.error ?? "Kredi yükleme başarısız.");
        setLoading(false);
        return;
      }

      setSuccessText(
        `✓ ${parsedAmount} kredi başarıyla yüklendi. Yeni bakiye: ${json.newBalance ?? "—"}`
      );

      setRecentLoads((prev) => [
        {
          userId: userId.trim(),
          amount: parsedAmount,
          description: description.trim() || "Admin manuel yükleme",
          newBalance: json.newBalance ?? 0,
          loadedAt: new Date().toLocaleString("tr-TR"),
        },
        ...prev.slice(0, 9),
      ]);

      setUserId("");
      setAmount("");
      setDescription("");
    } catch {
      setErrorText("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
          Admin Panel
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">💳 Kredi Yönetimi</h1>
        <p className="mt-2 text-sm text-slate-400">
          Kullanıcı hesabına manuel kredi ekleyin.
        </p>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-white/10 bg-white/5 p-6 space-y-5 backdrop-blur-xl"
      >
        <div>
          <label
            htmlFor="userId"
            className="block mb-2 text-sm text-slate-300"
          >
            Kullanıcı ID (UUID)
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-400/40"
            required
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block mb-2 text-sm text-slate-300"
          >
            Kredi Miktarı
          </label>
          <input
            id="amount"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-400/40"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block mb-2 text-sm text-slate-300"
          >
            Açıklama <span className="text-slate-500">(opsiyonel)</span>
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Starter paketi satın alındı"
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder-slate-600 outline-none focus:border-cyan-400/40"
          />
        </div>

        {errorText && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorText}
          </div>
        )}
        {successText && (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successText}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Yükleniyor..." : "Krediyi Yükle"}
        </button>
      </form>

      {/* ── Recent loads ───────────────────────────────────────────────────── */}
      {recentLoads.length > 0 && (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Son Yüklenen Krediler
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Kullanıcı ID</th>
                  <th className="pb-3 pr-4">Miktar</th>
                  <th className="pb-3 pr-4">Yeni Bakiye</th>
                  <th className="pb-3 pr-4">Açıklama</th>
                  <th className="pb-3">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentLoads.map((row, idx) => (
                  <tr key={idx} className="text-slate-300">
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                      {row.userId.slice(0, 8)}…
                    </td>
                    <td className="py-3 pr-4 font-semibold text-emerald-400">
                      +{row.amount}
                    </td>
                    <td className="py-3 pr-4">{row.newBalance}</td>
                    <td className="py-3 pr-4 text-slate-400">
                      {row.description}
                    </td>
                    <td className="py-3 text-slate-500">{row.loadedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
