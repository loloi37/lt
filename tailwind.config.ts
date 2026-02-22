import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F5F2ED',
        charcoal: '#36454F',
        sand: '#D8D2C4',
        mist: '#8AABB4',
        stone: '#9E8E82',
        parchment: '#EDE9E1',
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
