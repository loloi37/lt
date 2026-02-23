import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
<<<<<<< HEAD
        ivory: '#F5F2ED',
        charcoal: '#36454F',
        sand: '#D8D2C4',
        mist: '#8AABB4',
        stone: '#9E8E82',
        parchment: '#EDE9E1',
=======
        ivory: '#fdf6f0',
        charcoal: '#5a6b78',
        sand: '#e8d8cc',
        terracotta: '#d4958a',
        sage: '#89b896',
        lavender: '#b5a7c7',
        blush: '#f0c4c8',
        peach: '#f0c4a8',
>>>>>>> a4f7f7fb2118bb7f03022eb0256075d77c94f3a9
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
