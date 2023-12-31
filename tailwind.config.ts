import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    colors: {
      'primary': '#079A92',
      'secondary': "#959595",
      'neutralPrimary': "#272727",
      'white': "#ffffff",
      'underline': "#E6E6E6",
      'field': "#F7F7F7",
      'blue': "#87CEFA",
      'red': '#F81E1E',
      'green': '#34B207'
    },
  },
  plugins: [],
}
export default config
