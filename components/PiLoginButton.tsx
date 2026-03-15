"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { initPi, isPiBrowser } from "@/lib/pi";

export default function PiLoginButton() {
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      // SDK'nın yüklenmesi için kısa bir bekleme
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (mounted && isPiBrowser()) {
        const ok = initPi(); // Sayfa açılırken SDK'yı başlat
        if (ok) setIsReady(true);
      }
    };

    boot();
    return () => { mounted = false; };
  }, []);

  async function handlePiLogin() {
    const supabase = createClient();

    try {
      setLoading(true);
      setMessage("");

      if (!window.Pi) {
        throw new Error("Pi SDK hazır değil. Pi Browser'ı yenilemeyi deneyin.");
      }

      // Kullanıcıdan izin iste
      const auth = await window.Pi.authenticate(
        ["username", "payments"],
        (onIncompletePaymentFound: any) => {
          console.log("Tamamlanmamış ödeme bulundu:", onIncompletePaymentFound);
        }
      );

      // Backend'e gönder
      const res = await fetch("/api/pi/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auth),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Giriş işlemi başarısız.");

      [span_2](start_span)// Supabase ile oturum aç[span_2](end_span)
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      window.location.href = "/dashboard";
    } catch (e: any) {
      console.error("Giriş Hatası:", e);
      setMessage(e?.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (!isReady) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handlePiLogin}
        disabled={loading}
        className="rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50 transition-all"
      >
        {loading ? "Bağlanıyor..." : "Pi ile Giriş"}
      </button>
      {message && <p className="text-xs text-red-400 font-medium">{message}</p>}
    </div>
  );
}
