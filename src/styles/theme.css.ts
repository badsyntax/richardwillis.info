import { createTheme, style } from '@vanilla-extract/css';

// $theme-background: #1e1e1e;
// $theme-text-color: #d4d4d4;
// $theme-link-color: #569cd6;
// $theme-heading-color: #ce9178;
// $theme-tags-color: #73c991;
// $theme-spacing-xs: 4px;
// $theme-spacing-sm: 10px;
// $theme-spacing-md: 16px;
// $theme-spacing-lg: 26px;
// $theme-spacing-xl: 36px;
// $theme-spacing-xxl: 48px;
// $theme-font-size-sm: 0.6rem;
// $theme-font-size-base: 1rem;
// $theme-font-size-md: 1.05rem;
// $theme-font-size-lg: 1.4rem;
// $theme-font-size-xl: 1.8rem;
// $theme-font-size-xxl: 2.25rem;
// $theme-font-size-2xl: 3.5rem;
// $theme-shell-width: 68rem;

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue',
    background: '#1e1e1e',
    link: '#569cd6',
    heading: '#ce9178',
    tags: '#73c991',
  },
  spacing: {
    xs: '4px',
    sm: '10px',
    md: '16px',
    lg: '26px',
    xl: '36px',
    xxl: '48px',
  },
  font: {
    body: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    size: {
      sm: '0.6rem',
      base: '1rem',
      md: '1.05rem',
      lg: '1.4rem',
      xl: '1.8rem',
      xxl: '2.25rem',
      '2xl': '3.5rem',
    },
  },
});
