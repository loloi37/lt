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
        // Aurora glassmorphic palette
        'aurora-deep': '#0F056B',
        'aurora-glow': '#d2d0ff',
        'aurora-accent': '#7c6ff7',
        'aurora-text': '#e8e6ff',
        'aurora-emerald': '#34d399',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-cormorant)'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'aurora-drift': 'auroraDrift 15s ease-in-out infinite alternate',
        'pulse-secure': 'pulseSecure 2s ease-in-out infinite',
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
        auroraDrift: {
          '0%': { transform: 'translateX(-20%) translateY(-10%) rotate(0deg)', opacity: '0.4' },
          '100%': { transform: 'translateX(-10%) translateY(-5%) rotate(360deg)', opacity: '0.4' },
        },
        pulseSecure: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(52, 211, 153, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(52, 211, 153, 0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
