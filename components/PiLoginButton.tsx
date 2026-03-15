"use client";

import { useEffect, useState } from "react";
import { initPi, isPiBrowser } from "@/lib/pi";

type PiAuthResponse = {
  user?: {
    uid?: string;
    username?: string;
  };
  accessToken?: string;
};

export default function PiLoginButton() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (!cancelled && isPiBrowser()) {
        const ok = initPi();
        if (ok) {
          setReady(true);
        }
      }
    };

    boot();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePiLogin = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (!isPiBrowser()) {
        setMessage("Pi Browser içinde açmalısın.");
        return;
      }

      const ok = initPi();
      const Pi = (window as Window & { Pi?: any }).Pi;

      if (!ok || !Pi) {
        setMessage("Pi SDK hazır değil.");
        return;
      }

      const auth: PiAuthResponse = await Pi.authenticate(
        ["username", "payments"],
        () => {}
      );

      if (!auth?.user?.uid) {
        setMessage("Pi kullanıcı bilgisi alınamadı.");
        return;
      }

      const res = await fetch("/api/pi/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        actionLink?: string;
        error?: string;
      };

      if (!res.ok) {
        setMessage(data?.error || "Pi giriş API hatası.");
        return;
      }

      if (!data?.actionLink) {
        setMessage("Giriş linki oluşturulamadı.");
        return;
      }

      window.location.href = data.actionLink;
    } catch (error: unknown) {
      const err = error as Error;
      setMessage(err?.message || "Pi login hatası.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handlePiLogin}
        disabled={loading}
        className="rounded-2xl bg-purple-600 px-5 py-3 text-white transition hover:bg-purple-500 disabled:opacity-60"
      >
        {loading ? "Bağlanıyor..." : "Pi ile Giriş"}
      </button>

      {message ? <p className="text-sm text-red-400">{message}</p> : null}
    </div>
  );
}
