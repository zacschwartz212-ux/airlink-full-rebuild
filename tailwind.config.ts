import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#10b981',
          50:'#ecfdf5',100:'#d1fae5',200:'#a7f3d0',300:'#6ee7b7',400:'#34d399',
          500:'#10b981',600:'#059669',700:'#047857',800:'#065f46',900:'#064e3b'
        },
        ink: '#0f172a'
      },
      boxShadow: { soft: '0 6px 20px rgba(2, 6, 23, 0.08)' }
    }
  },
  plugins: []
} satisfies Config
