"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function PiLoginButton() {
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      setIsPiBrowser(true);
    }
  }, []);

  async function handlePiLogin() {
    const supabase = createClient();

    try {
      setLoading(true);
      setMessage("");

      const Pi = (window as any).Pi;

      if (!Pi) {
        setMessage("Pi Browser içinde açmalısın.");
        return;
      }

      Pi.init({
        version: "2.0",
        sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
      });

      const auth = await Pi.authenticate(["username", "payments"], () => {});

      const res = await fetch("/api/pi/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.error || "Pi login başarısız.");
        return;
      }

      const { email, password } = data;

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch (e) {
      console.error(e);
      setMessage("Pi login hatası.");
    } finally {
      setLoading(false);
    }
  }

  if (!isPiBrowser) return null;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePiLogin}
        disabled={loading}
        className="rounded-xl bg-purple-600 px-4 py-2 text-white"
      >
        {loading ? "Bağlanıyor..." : "Pi ile Giriş"}
      </button>

      {message && <p className="text-xs text-red-400">{message}</p>}
    </div>
  );
}
