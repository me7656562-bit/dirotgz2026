import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // מכשירים קטנים מרובעים כמו Xiaomi F25
        'xs': '320px',
        'sm-square': {'raw': '(max-width: 480px) and (max-height: 640px)'},
        'tiny': {'raw': '(max-width: 400px)'},
      },
    },
  },
  plugins: [],
}

export default config