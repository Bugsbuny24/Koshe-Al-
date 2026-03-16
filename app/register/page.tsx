"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleRegister} className="space-y-4 w-96">
        <h1 className="text-2xl font-bold">Hesap Oluştur</h1>

        <input
          className="border p-2 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black text-white p-2 w-full"
          disabled={loading}
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
