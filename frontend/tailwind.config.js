import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        border: 'oklch(0.26 0.07 265)',
        input: 'oklch(0.22 0.06 265)',
        ring: 'oklch(0.80 0.17 82)',
        background: 'oklch(0.11 0.055 265)',
        foreground: 'oklch(0.96 0.01 255)',
        primary: {
          DEFAULT: 'oklch(0.80 0.17 82)',
          foreground: 'oklch(0.10 0.04 265)'
        },
        secondary: {
          DEFAULT: 'oklch(0.62 0.22 238)',
          foreground: 'oklch(0.10 0.04 265)'
        },
        destructive: {
          DEFAULT: 'oklch(0.577 0.245 27.325)',
          foreground: 'oklch(0.985 0 0)'
        },
        muted: {
          DEFAULT: 'oklch(0.20 0.055 265)',
          foreground: 'oklch(0.62 0.05 255)'
        },
        accent: {
          DEFAULT: 'oklch(0.22 0.06 265)',
          foreground: 'oklch(0.80 0.17 82)'
        },
        popover: {
          DEFAULT: 'oklch(0.17 0.06 265)',
          foreground: 'oklch(0.96 0.01 255)'
        },
        card: {
          DEFAULT: 'oklch(0.15 0.06 265)',
          foreground: 'oklch(0.96 0.01 255)'
        },
        success: {
          DEFAULT: 'oklch(0.60 0.20 145)',
          foreground: 'oklch(0.10 0.04 265)'
        },
        gold: {
          DEFAULT: 'oklch(0.80 0.17 82)',
          light: 'oklch(0.88 0.14 82)',
          dark: 'oklch(0.68 0.19 72)',
        },
        navy: {
          deep: 'oklch(0.09 0.05 265)',
          mid: 'oklch(0.14 0.06 265)',
          light: 'oklch(0.20 0.065 265)',
        },
        sky: {
          DEFAULT: 'oklch(0.65 0.22 238)',
        },
        chart: {
          1: 'oklch(0.80 0.17 82)',
          2: 'oklch(0.65 0.22 238)',
          3: 'oklch(0.60 0.20 145)',
          4: 'oklch(0.68 0.22 30)',
          5: 'oklch(0.72 0.20 200)'
        },
        sidebar: {
          DEFAULT: 'oklch(0.10 0.055 265)',
          foreground: 'oklch(0.96 0.01 255)',
          primary: 'oklch(0.80 0.17 82)',
          'primary-foreground': 'oklch(0.10 0.04 265)',
          accent: 'oklch(0.18 0.06 265)',
          'accent-foreground': 'oklch(0.96 0.01 255)',
          border: 'oklch(0.26 0.07 265)',
          ring: 'oklch(0.80 0.17 82)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
        gold: '0 0 24px rgba(210, 165, 30, 0.35)',
        'gold-lg': '0 0 48px rgba(210, 165, 30, 0.45)',
        sky: '0 0 20px rgba(80, 160, 230, 0.30)',
        navy: '0 4px 28px rgba(0, 0, 50, 0.6)',
        success: '0 0 20px rgba(60, 180, 100, 0.30)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 12px rgba(210, 165, 30, 0.3)' },
          '50%': { boxShadow: '0 0 28px rgba(210, 165, 30, 0.6)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      }
    }
  },
  plugins: [typography, containerQueries, animate]
};
