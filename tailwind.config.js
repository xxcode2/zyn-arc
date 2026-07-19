/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B0E14',
          soft: '#12161F',
          line: '#232838',
        },
        paper: {
          DEFAULT: '#F6F3EC',
          dim: '#EDE8DB',
          line: '#D8D2C0',
        },
        seal: {
          green: '#1F6B4A',
          greenLight: '#2E8B63',
          gold: '#C9A24B',
          rust: '#B3462F',
        },
        muted: '#8A93A6',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          '"SF Mono"',
          '"Roboto Mono"',
          'Menlo',
          'Consolas',
          'monospace',
        ],
      },
      backgroundImage: {
        grain: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grain: '18px 18px',
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(2.2) rotate(-14deg)', opacity: '0' },
          '55%': { transform: 'scale(0.92) rotate(-8deg)', opacity: '1' },
          '75%': { transform: 'scale(1.04) rotate(-10deg)' },
          '100%': { transform: 'scale(1) rotate(-8deg)', opacity: '1' },
        },
        pulseLine: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        stamp: 'stamp 0.5s cubic-bezier(.2,1.4,.4,1) forwards',
        ticker: 'ticker 22s linear infinite',
      },
    },
  },
  plugins: [],
};
