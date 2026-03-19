/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pi-gold': '#F0A500',
        'pi-gold-dim': '#C47F00',
        'pi-orange': '#FF6B2B',
        'bg-void': '#060608',
        'bg-deep': '#0C0C10',
        'bg-card': '#111116',
        'bg-card-hover': '#16161E',
        'accent-blue': '#3D7BFF',
        'accent-green': '#00D16C',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
        body: ['Cabinet Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
