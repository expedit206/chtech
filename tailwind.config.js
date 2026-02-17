/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        surface: 'var(--color-surface)',
        bg: 'var(--color-bg)',
        border: 'var(--color-border)',
        'text-main': 'var(--color-text-main)',
        'text-sub': 'var(--color-text-sub)',
        pure: 'var(--color-pure)',
      }
    },
  },
  plugins: [],
}
