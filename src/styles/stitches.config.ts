import { createStitches } from '@stitches/react';
import type * as Stitches from '@stitches/react';

export const { styled, getCssText, theme, config, css } = createStitches({
  theme: {
    colors: {
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
    space: {
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
    fontSizes: {
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
    fonts: {
      body: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    },
    fontWeights: {},
    lineHeights: {
      baseP: '1.5rem',
      mdP: '1.55rem',
      baseH1: '2.25rem',
      mdH1: '3.6rem',
    },
    media: {
      bpxs: '(min-width: 320px)',
      bpsm: '(min-width: 640px)',
      bpmd: '(min-width: 1024px)',
      bplg: '(min-width: 1200px)',
      tablet: '(min-width: 768px)',
      desktop: '(min-width: 1024px)',
    },
    letterSpacings: {},
    sizes: {},
    borderWidths: {},
    borderStyles: {},
    radii: {},
    shadows: {},
    zIndices: {},
    transitions: {},
  },
});

export type CSS = Stitches.CSS<typeof config>;
