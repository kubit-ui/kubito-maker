/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kubito: {
          primary: '#DF2B51',
          'primary-hover': '#E44B66',
          'primary-pressed': '#A01D39',
          secondary: '#FFC8D3',
          'secondary-bg': '#FFEFF2',
          neutral: {
            50: '#1A1A1A',
            100: '#4F4F4F',
            150: '#767676',
            200: '#F4F4F4',
            250: '#FFFFFF',
          },
          error: '#FF003C',
          success: '#5CA40A',
          warning: '#FFC000',
          info: '#00A4A4',
        },
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      fontSize: {
        'heading-1': ['3rem', '3.5rem'],
        'heading-2': ['2.5rem', '3rem'],
        'heading-3': ['2rem', '2.5rem'],
        'heading-4': ['1.5rem', '1.5rem'],
        'heading-5': ['1.25rem', '1.25rem'],
        'body-lg': ['1.125rem', '1.5rem'],
        'body-md': ['1rem', '1.5rem'],
        'body-sm': ['0.875rem', '1.25rem'],
        'body-xs': ['0.75rem', '1rem'],
      },
      fontWeight: {
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      borderRadius: {
        'kubito-sm': '0.13rem',
        'kubito-md': '0.25rem',
        'kubito-lg': '0.5rem',
        'kubito-xl': '6.25rem',
      },
      spacing: {
        25: '0.25rem',
        50: '0.5rem',
        100: '0.75rem',
        150: '1rem',
        200: '1.25rem',
        250: '1.5rem',
        300: '2rem',
        350: '2.5rem',
        400: '3rem',
        450: '3.5rem',
        500: '4.5rem',
        550: '6rem',
      },
      boxShadow: {
        kubito: '0px 2px 8px 0px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
