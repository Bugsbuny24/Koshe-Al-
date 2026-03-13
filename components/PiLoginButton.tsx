"use client";

import { useState } from "react";
import { initPi, isPiBrowser } from "@/lib/pi";

export default function PiLoginButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin() {
    setMessage("");

    if (!isPiBrowser()) {
      setMessage("Bu özellik sadece Pi Browser içinde çalışır.");
      return;
    }

    try {
      setLoading(true);
      initPi();

      const auth = await window.Pi!.authenticate(["username", "payments"]);

      const res = await fetch("/api/pi/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Pi login başarısız.");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pi login hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-[#6b3df5] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Bağlanıyor..." : "Pi ile Giriş"}
      </button>

      {message ? <p className="text-xs text-amber-300">{message}</p> : null}
    </div>
  );
}
