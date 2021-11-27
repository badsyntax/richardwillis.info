import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { createGlobalTheme, createTheme } from '@vanilla-extract/css';

// NOTE: the order of these tokens adjusts the specificity!

export const tokens = {
  pageShell: {
    maxWidth: '68rem',
  },
  header: {
    height: {
      mobile: '3.5rem',
      desktop: '4rem',
    },
  },
  // TODO: align color palette with vscode
  color: {
    brand: 'blue',
    background: '#1e1e1e',
    text: '#d4d4d4',
    heading: '#ce9178',
    header: 'rgb(51, 51, 51)',
    gray: '#333333', // FIXME
    link: '#569cd6',
    white: 'white', // FIX``ME
    tags: '#73c991',
  },
  filter: {
    blur: 'blur(4px)',
    none: 'none',
  },
  spacing: {
    xxl: '48px',
    xl: '36px',
    lg: '26px',
    md: '16px',
    sm: '10px',
    xs: '4px',
    none: '0px',
    pageShellMarginTopMobile: '3.5rem',
    pageShellMarginTopDesktop: '4rem',
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
      'home-title-mobile': '14vw',
      'home-title-desktop': '3.5rem',
      'home-description-mobile': '8vw',
      'home-description-desktop': '2.25rem',
    },
    lineHeight: {
      baseP: '1.5rem',
      mdP: '1.55rem',
      baseH1: '2.25rem',
      mdH1: '3.6rem',
    },
  },
  breakpoint: {
    xs: '320px',
    sm: '640px',
    md: '1024px',
    lg: '1200px',
    tablet: '768px',
    desktop: '1024px',
  },
};

export const theme = createGlobalTheme(':root', tokens);

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { '@media': `screen and (min-width: ${tokens.breakpoint.tablet})` },
    desktop: {
      '@media': `screen and (min-width: ${tokens.breakpoint.desktop})`,
    },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['flex', 'block', 'inline', 'inline-flex', 'inline-block', 'none'],
    flexDirection: ['row', 'column'],
    minHeight: ['100%'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    alignSelf: ['stretch'],
    paddingTop: theme.spacing,
    paddingBottom: theme.spacing,
    paddingLeft: theme.spacing,
    paddingRight: theme.spacing,
    marginTop: theme.spacing,
    marginBottom: theme.spacing,
    marginLeft: theme.spacing,
    marginRight: theme.spacing,
    fontSize: theme.font.size,
    height: {
      headerMobile: theme.header.height.mobile,
      headerDesktop: theme.header.height.desktop,
    },
    lineHeight: {
      ...theme.font.size,
      ...theme.font.lineHeight,
    },
    filter: theme.filter,
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    placeItems: ['justifyContent', 'alignItems'],
  },
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' },
    default: {},
    hover: { selector: '&:hover' },
    focus: { selector: '&:focus' },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: theme.color,
    background: theme.color,
    backgroundColor: theme.color,
  },
});

export const themeStyle = createSprinkles(
  responsiveProperties,
  colorProperties
);

export type ThemeStyle = Parameters<typeof themeStyle>[0];
