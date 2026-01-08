import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Healthcare-focused color palette
        primary: {
          50: '#e6f2f9',   // Very light tint for backgrounds
          100: '#cce5f3',  // Light tint for hover backgrounds
          200: '#99cbe7',  // Light blue
          300: '#65bde6',  // Brand accent color (light)
          400: '#3398ce',  // Intermediate
          500: '#0070b8',  // Brand secondary color (medium)
          600: '#005086',  // Brand primary color (main)
          700: '#004069',  // Darker for text on light backgrounds
          800: '#00304d',  // Even darker for headers
          900: '#002030',  // Very dark for high contrast
          950: '#001018',  // Nearly black
        },
        medical: {
          blue: '#005086',        // Updated to match new primary
          'blue-light': '#0070b8', // Updated to match new secondary
          'blue-dark': '#004069',  // Updated to match darker shade
          green: '#10b981',
          'green-light': '#34d399',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(35px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideUpSmall: {
          '0%': { opacity: '0', transform: 'translateY(25px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeSlideRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 600ms ease-out both',
        'fade-slide-up-delay-1': 'fadeSlideUp 600ms ease-out 100ms both',
        'fade-slide-up-delay-2': 'fadeSlideUp 600ms ease-out 200ms both',
        'fade-slide-up-small': 'fadeSlideUpSmall 500ms ease-out both',
        'fade-slide-left': 'fadeSlideLeft 700ms ease-out 150ms both',
        'fade-slide-right': 'fadeSlideRight 700ms ease-out 150ms both',
      },
    },
  },
  plugins: [],
};

export default config;
