/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['"Instrument Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: '#0a0a0a',
        paper: '#fafaf8',
        sage: {
          50: '#f2f7f4',
          100: '#d9ede0',
          400: '#5aab78',
          500: '#38895a',
          600: '#2d7049',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        crimson: '#dc2626',
      },
    },
  },
  plugins: [],
}
