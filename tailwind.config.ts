import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0F1A',
        midnight: '#1A1D2E',
        violet: '#6C5CE7',
        mint: '#00B894',
        ocean: '#1860A5',
        coral: '#E17055',
        amberline: '#C47A2C',
        surface: '#F8F9FF',
      },
      boxShadow: {
        lift: '0 18px 50px rgba(13, 15, 26, 0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
