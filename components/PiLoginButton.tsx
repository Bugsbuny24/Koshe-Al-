"use client";

export default function PiLoginButton() {
  const handlePiLogin = async () => {
    try {
      if (!window.Pi) {
        alert("Pi Browser içinde aç.");
        return;
      }

      // EN KRİTİK SATIR
      await window.Pi.init({ version: "2.0" });

      const auth = await window.Pi.authenticate(
        ["username", "payments"],
        () => {}
      );

      await fetch("/api/pi/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auth),
      });

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Pi login error:", err);
    }
  };

  return (
    <button
      onClick={handlePiLogin}
      className="rounded-xl bg-purple-600 px-4 py-2 text-white"
    >
      Pi ile Giriş
    </button>
  );
}
