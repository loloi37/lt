import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#f9f7f3',
        charcoal: '#2c3e50',
        sand: '#d7ccc8',
        terracotta: '#a0522d',
        sage: '#8a9a5b',
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