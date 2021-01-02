const typography = require('@tailwindcss/typography');

module.exports = {
  purge: ['./pages/**/*.tsx', './features/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              fontWeight: 500,
              borderRadius: '0.2rem',
              backgroundColor: '#eee',
              padding: '1px 4px',
            },
          },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typography],
};
