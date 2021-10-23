import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';

export const space = {
  xs: '4px',
  sm: '10px',
  md: '16px',
  lg: '26px',
  xl: '36px',
  xxl: '48px',
};

export const breakpoint = {
  xs: '320px',
  sm: '640px',
  md: '1024px',
  lg: '1200px',
  tablet: '768px',
  desktop: '1024px',
};

const responsiveStyles = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: { '@media': `screen and (min-width: ${breakpoint.tablet})` },
    desktop: { '@media': `screen and (min-width: ${breakpoint.desktop})` },
  },
  defaultCondition: 'mobile',
  properties: {
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    placeItems: ['justifyContent', 'alignItems'],
  },
});

const colors = {
  background: '#1e1e1e',
  link: '#569cd6',
  heading: '#ce9178',
  tags: '#73c991',
};

const colorStyles = createAtomicStyles({
  conditions: {
    lightMode: {},
    darkMode: { '@media': '(prefers-color-scheme: dark)' },
  },
  defaultCondition: 'lightMode',
  properties: {
    color: colors,
    background: colors,
  },
});

export const atoms = createAtomsFn(responsiveStyles, colorStyles);

export type Atoms = Parameters<typeof atoms>[0];
