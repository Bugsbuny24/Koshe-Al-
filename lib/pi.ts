// lib/pi.ts
declare global {
  interface Window {
    Pi?: any;
  }
}

export function isPiBrowser() {
  return typeof window !== "undefined" && !!window.Pi;
}

export function initPi() {
  if (typeof window === "undefined" || !window.Pi) return false;

  try {
    window.Pi.init({
      version: "2.0",
      // Render panelindeki NEXT_PUBLIC_PI_SANDBOX değerine bakar
      sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
    });
    return true;
  } catch (err) {
    console.error("Pi Init Hatası:", err);
    return false;
  }
}
