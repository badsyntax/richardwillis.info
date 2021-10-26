import { style } from '@vanilla-extract/css';
import { theme, themeStyle } from '../../../styles/theme.css';
import { screenReaderOnly } from '../../../styles/util.css';

export const mobileNav = style([
  themeStyle({
    display: 'none',
    flexDirection: 'column',
    background: 'gray',
  }),
  {
    flexBasis: '100%',
  },
]);

export const mobileNavVisible = themeStyle({
  display: {
    mobile: 'flex',
    desktop: 'none',
  },
});

export const menuButton = style([
  themeStyle({
    fontSize: 'xxl',
    display: {
      mobile: 'inline-flex',
      desktop: 'none',
    },
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  }),
  {
    backgroundColor: 'transparent',
    border: 0,
    position: 'absolute',
    left: theme.spacing.md,
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        color: '#ce9178', // FIXME
      },
    },
  },
]);

export const menuButtonLabel = style([screenReaderOnly]);

export const overlay = style([
  themeStyle({
    display: {
      desktop: 'none',
    },
  }),
  {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
]);
