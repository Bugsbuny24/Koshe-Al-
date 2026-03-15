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
      // SDK objesi sayfaya düşsün diye kısa bekleme
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (mounted && isPiBrowser()) {
        setIsReady(true);
      }
    };

    boot();

    return () => {
      mounted = false;
    };
  }, []);

  async function handlePiLogin() {
    const supabase = createClient();

    try {
      setLoading(true);
      setMessage("");

      if (!isPiBrowser()) {
        setMessage("Pi Browser içinde açmalısın.");
        return;
      }

      const initialized = initPi();

      if (!initialized || !(window as any).Pi) {
        setMessage("Pi SDK hazır değil. Uygulamayı Pi Browser içinde yeniden aç.");
        return;
      }

      const auth = await (window as any).Pi.authenticate(
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
        setMessage(data?.error || "Pi auth API hatası.");
        console.error("PI AUTH API ERROR:", data);
        return;
      }

      const { email, password } = data;

      if (!email || !password) {
        setMessage("Pi auth dönüşü eksik.");
        console.error("PI AUTH RESPONSE INVALID:", data);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || "Supabase session açılamadı.");
        console.error("SUPABASE SIGNIN ERROR:", error);
        return;
      }

      window.location.href = "/dashboard";
    } catch (e: any) {
      console.error("PI LOGIN CATCH ERROR:", e);
      setMessage(e?.message || "Bilinmeyen Pi login hatası.");
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
        className="rounded-xl bg-purple-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Bağlanıyor..." : "Pi ile Giriş"}
      </button>

      {message ? <p className="text-xs text-red-400">{message}</p> : null}
    </div>
  );
}
