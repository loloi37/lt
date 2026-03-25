import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Unified warm / olive palette (source: pricing page) ──
        'olive': '#5b6a31',
        'warm-dark': '#393830',
        'warm-muted': '#66645b',
        'warm-outline': '#838176',
        'warm-border': '#bdb9ae',
        'plum': '#695e88',
        'warm-brown': '#7b5e52',
        'warm-bg': '#fffbff',
        'surface-low': '#fdf9f0',
        'surface-mid': '#f8f3e9',
        'surface-high': '#f2eee3',
        'surface-highest': '#ece8dc',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['SerifDual', 'var(--font-serif-alpha)', 'Georgia', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.7s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'breathe': 'breathe 6s ease-in-out infinite',
        'glow-warm': 'glowWarm 3s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        glowWarm: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(138, 117, 96, 0.2)' },
          '50%': { boxShadow: '0 0 0 4px rgba(138, 117, 96, 0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
