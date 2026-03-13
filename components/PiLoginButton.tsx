"use client";

import { useState } from "react";

export default function PiLoginButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handlePiLogin() {
    try {
      setLoading(true);
      setMessage("");

      if (!window.Pi) {
        setMessage("Pi Browser içinde açmalısın.");
        return;
      }

      window.Pi.init({ version: "2.0" });

      const auth = await window.Pi.authenticate(
        ["username", "payments"],
        () => {}
      );

      const res = await fetch("/api/pi/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || "Pi ile giriş başarısız.");
        return;
      }

      // Burada direkt dashboard yerine login'e yönlendiriyoruz
      // çünkü gerçek Supabase session lazım
      if (data?.redirectTo) {
        window.location.href = data.redirectTo;
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Pi login error:", error);
      setMessage("Pi ile giriş sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handlePiLogin}
        disabled={loading}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-purple-600 px-4 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-50"
      >
        {loading ? "Bağlanıyor..." : "Pi ile Giriş"}
      </button>

      {message ? (
        <p className="max-w-[220px] text-xs leading-5 text-amber-300">
          {message}
        </p>
      ) : null}
    </div>
  );
}
