import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 0 40px rgba(99,102,241,0.25)"
      }
    }
  },
  plugins: []
} satisfies Config;
