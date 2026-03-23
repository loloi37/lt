import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#fdf6f0',
        charcoal: '#5a6b78',
        sand: '#e8d8cc',
        terracotta: '#d4958a',
        sage: '#89b896',
        lavender: '#b5a7c7',
        blush: '#f0c4c8',
        peach: '#f0c4a8',
        parchment: '#EDE9E1',
        mist: '#8AABB4',
        stone: '#9E8E82',
        // Dark luxury palette
        obsidian: '#1a1a2e',
        midnight: '#16213e',
        'slate-deep': '#0f3460',
        gold: '#c9a84c',
        platinum: '#e5e5e5',
        'amber-warm': '#d4a574',
        'vault-dark': '#111318',
        'vault-card': '#1a1d24',
        'vault-border': '#2a2d35',
        'vault-text': '#c8ccd4',
        'vault-muted': '#6b7280',
        // Aurora refined palette
        'aurora-deep': '#08080c',
        'aurora-surface': '#111116',
        'aurora-card': '#18181f',
        'aurora-border': '#252530',
        'aurora-glow': '#c9a84c',
        'aurora-accent': '#d4a574',
        'aurora-text': '#e8e5df',
        'aurora-muted': '#7a7670',
        'aurora-emerald': '#6db88f',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-cormorant)'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.3)' },
          '50%': { boxShadow: '0 0 0 6px rgba(201, 168, 76, 0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
