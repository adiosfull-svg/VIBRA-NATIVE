// Stessa config Tailwind dell'app web originale (tailwind.config.js di Base44), con i colori
// delle variabili CSS (:root di src/index.css, tema scuro unico) già risolti in esadecimale:
// così le classi originali (bg-card, text-muted-foreground, bg-primary/20...) restano identiche.
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // come l'originale
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter'],
        display: ['PlayfairDisplay'],
        sans: ['Inter'],
      },
      borderRadius: {
        lg: '0.75rem', // --radius
        md: 'calc(0.75rem - 2px)',
        sm: 'calc(0.75rem - 4px)',
      },
      colors: {
        background: '#09090b',
        foreground: '#f2f2f2',
        card: { DEFAULT: '#131316', foreground: '#f2f2f2' },
        popover: { DEFAULT: '#131316', foreground: '#f2f2f2' },
        primary: { DEFAULT: '#561a8e', foreground: '#ffffff' },
        secondary: { DEFAULT: '#222225', foreground: '#e6e6e6' },
        muted: { DEFAULT: '#222225', foreground: '#878792' },
        accent: { DEFAULT: '#341f47', foreground: '#cdadeb' },
        destructive: { DEFAULT: '#dc2828', foreground: '#ffffff' },
        border: '#2c2c30',
        input: '#2c2c30',
        ring: '#561a8e',
        chart: { 1: '#561a8e', 2: '#269dd9', 3: '#2eb873', 4: '#e8ab30', 5: '#d74273' },
        sidebar: {
          DEFAULT: '#0e0e10',
          foreground: '#e6e6e6',
          primary: '#561a8e',
          'primary-foreground': '#ffffff',
          accent: '#271736',
          'accent-foreground': '#cdadeb',
          border: '#242428',
          ring: '#561a8e',
        },
      },
    },
  },
  plugins: [],
};
