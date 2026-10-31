/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      heading: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Space Mono', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      'heading-xxl': ['clamp(2.5rem, 5vw + 1rem, 4.25rem)',        { lineHeight: '1.1',  fontWeight: '600', letterSpacing: '-0.025em' }],
      'heading-xl':  ['clamp(2.25rem, 4.75vw + 0.75rem, 3.75rem)', { lineHeight: '1.1',  fontWeight: '600', letterSpacing: '-0.025em' }],
      'heading-lg':  ['clamp(2rem, 4.25vw + 0.5rem, 3.375rem)',    { lineHeight: '1.12', fontWeight: '600', letterSpacing: '-0.025em' }],
      'heading-md':  ['clamp(1.875rem, 3.5vw + 0.5rem, 3rem)',     { lineHeight: '1.14', fontWeight: '600', letterSpacing: '-0.025em' }],
      'heading-sm':  ['clamp(1.625rem, 3vw + 0.5rem, 2.5rem)',     { lineHeight: '1.16', fontWeight: '600', letterSpacing: '-0.025em' }],
      'heading-xs':  ['clamp(1.5rem, 2.25vw + 0.5rem, 2.125rem)',  { lineHeight: '1.2',  fontWeight: '600', letterSpacing: '-0.025em' }],

      'subtitle-lg': ['clamp(1.75rem, 2.5vw + 0.5rem, 2.375rem)',  { lineHeight: '1.1',  fontWeight: '600', letterSpacing: '-0.025em' }],
      'subtitle-md': ['clamp(1.5rem, 1.75vw + 0.5rem, 1.75rem)',   { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.025em' }],
      'subtitle-sm': ['clamp(1.25rem, 1.25vw + 0.4rem, 1.375rem)', { lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.025em' }],

      'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
      'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
      'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],

      'caption-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
    },
    extend: {
      colors: {
        brand: {
          primary: {
            darkest:  '#005070',
            dark:     '#0078A7',
            DEFAULT:  '#00A0DF',
            light:    '#73CBED',
            lightest: '#DFF1FA',
          },
          secondary: {
            darkest:  '#2F6E16',
            dark:     '#3E8E1F',
            DEFAULT:  '#74C947',
            light:    '#9BE070',
            lightest: '#E5F4DC',
          },
        },
        ink: {
          DEFAULT: '#111316',
          soft:    '#24272A',
        },
        semantics: {
          success: { dark: '#267C35', DEFAULT: '#37B24D', lightest: '#EBF7ED' },
          alert:   { dark: '#CA7900', DEFAULT: '#FC9700', lightest: '#FFF4D8' },
          error:   { dark: '#8C1D1D', DEFAULT: '#C8372D', lightest: '#F9EBEA' },
        },
        greyscale: {
          darkest:  '#16181D',
          dark:     '#3F3F3F',
          medium:   '#6B7075',
          DEFAULT:  '#717274',
          light:    '#E5E7EB',
          lightest: '#F2F3F5',
          white:    '#FFFFFF',
        },

        surface: {
          DEFAULT: '#F1F3F5',
          raised:  '#FFFFFF',
          sunken:  '#F4F5F5',
        },
        content: {
          DEFAULT: '#111316',
          strong:  '#24272A',
          muted:   '#5C6166',
          subtle:  '#6B7075',
          faint:   '#9AA0A6',
        },
        line: {
          DEFAULT: '#E6E8EB',
          soft:    '#ECEEF0',
          strong:  '#DADDE1',
        },
        /* Matches the visual reference even though it stays below 4.5:1 on the page background (spec 01). */
        accent: '#00A0DF',
      },
      borderRadius: {
        xs: '5px', sm: '6px', md: '8px', lg: '14px', xl: '16px', '2xl': '24px', panel: '28px', '3xl': '32px', sheet: '48px',
      },
      boxShadow: {
        soft: '0 8px 28px rgba(0,0,0,0.12)',
        lift: '0 30px 60px rgba(0,0,0,0.08)',
        deep: '0 40px 80px rgba(0,0,0,0.35)',
      },
      maxWidth: {
        site: '1440px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'wave': {
          '0%':   { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 36s linear infinite',
        wave: 'wave 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
