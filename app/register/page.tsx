"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e: any) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleRegister} className="w-96 space-y-4">

        <h1 className="text-2xl font-bold">Kayıt Ol</h1>

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

        <button className="bg-black text-white w-full p-2">
          Kayıt Ol
        </button>

      </form>
    </div>
  );
}
