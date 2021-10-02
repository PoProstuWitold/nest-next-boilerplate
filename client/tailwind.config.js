module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        container: {
            center: true,
            margin: 'auto',
            width: '100%',
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem'
            }
        },
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem',
            '6xl': '4rem',
        },
        extend: {
            colors: {
                gray: {
                    100: '#f7fafc',
                    200: '#edf2f7',
                    300: '#e2e8f0',
                    400: '#cbd5e0',
                    500: '#a0aec0',
                    600: '#718096',
                    700: '#4a5568',
                    800: '#2d3748',
                    900: '#1a202c',
                },
                blue: {
                    100: '#ebf8ff',
                    200: '#bee3f8',
                    300: '#90cdf4',
                    400: '#63b3ed',
                    500: '#4299e1',
                    600: '#3182ce',
                    700: '#2b6cb0',
                    800: '#2c5282',
                    900: '#2a4365',
                },
            },
        },
    },
    variants: {},
    plugins: [
        require('daisyui'),
        require('@tailwindcss/typography')
    ],
    daisyui: {
        styled: true,
        themes: true,
        base: true,
        utils: true,
        logs: true,
        rtl: false,
        themes: [
            'emerald',
            'dark', // and some pre-defined theme
            'forest',
            {
              'witq': {                          /* your theme name */
                 'primary' : '#a991f7',           /* Primary color */
                 'primary-focus' : '#8462f4',     /* Primary color - focused */
                 'primary-content' : '#ffffff',   /* Foreground content color to use on primary color */
      
                 'secondary' : '#f6d860',         /* Secondary color */
                 'secondary-focus' : '#f3cc30',   /* Secondary color - focused */
                 'secondary-content' : '#ffffff', /* Foreground content color to use on secondary color */
      
                 'accent' : '#37cdbe',            /* Accent color */
                 'accent-focus' : '#2aa79b',      /* Accent color - focused */
                 'accent-content' : '#ffffff',    /* Foreground content color to use on accent color */
      
                 'neutral' : '#3d4451',           /* Neutral color */
                 'neutral-focus' : '#2a2e37',     /* Neutral color - focused */
                 'neutral-content' : '#ffffff',   /* Foreground content color to use on neutral color */
      
                 'base-100' : '#ffffff',          /* Base color of page, used for blank backgrounds */
                 'base-200' : '#f9fafb',          /* Base color, a little darker */
                 'base-300' : '#d1d5db',          /* Base color, even more darker */
                 'base-content' : '#1f2937',      /* Foreground content color to use on base color */
      
                 'info' : '#2094f3',              /* Info */
                 'success' : '#009485',           /* Success */
                 'warning' : '#ff9900',           /* Warning */
                 'error' : '#ff5724',             /* Error */
              },
            },
          ]
    }
  };