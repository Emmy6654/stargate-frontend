import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0D0F1A',
        midnight: '#1A1D2E',
        violet: '#6C5CE7',
        mint: '#00CEC9',
        ocean: '#1860A5',
        coral: '#E17055',
        amberline: '#FDCB6E',
        surface: '#F8F9FF',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        accent: 'var(--color-accent)',
      },
      boxShadow: {
        lift: '0 18px 50px rgba(13, 15, 26, 0.10)',
        'glow-purple': 'var(--shadow-glow-purple)',
        'glow-teal': 'var(--shadow-glow-teal)',
      },
    },
  },
  plugins: [],
};

export default config;
