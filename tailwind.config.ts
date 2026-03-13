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
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-cormorant)'],
      },
    },
  },
  plugins: [],
}

export default config
