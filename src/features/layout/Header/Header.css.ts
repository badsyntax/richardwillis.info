import { style } from '@vanilla-extract/css';
import { theme, themeStyle } from '../../../styles/theme.css';

export const root = style([
  themeStyle({
    backgroundColor: 'header',
    height: {
      desktop: 'headerDesktop',
      mobile: 'headerMobile',
    },
  }),
  {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'fixed',
    top: '0px',
    width: '100%',
    zIndex: 10,
  },
]);

export const body = style([
  themeStyle({
    justifyContent: {
      mobile: 'center',
      desktop: 'space-between',
    },
    paddingLeft: 'lg',
    paddingRight: 'lg',
    display: 'flex',
    alignItems: 'center',
  }),
  {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: theme.pageShell.maxWidth,
    height: '100%',
  },
]);

export const title = style([
  themeStyle({
    fontSize: 'lg',
    lineHeight: 'lg',
    color: 'white',
  }),
  {
    flexShrink: 0,
    textDecoration: 'none',
    padding: 0,
  },
]);

export const nav = themeStyle({
  display: {
    mobile: 'none',
    desktop: 'flex',
  },
});
