import { style, composeStyles } from '@vanilla-extract/css';
import { themeStyle, tokens } from '../../../styles/theme.css';
export const root = themeStyle({});

export const main = style([
  themeStyle({
    paddingLeft: 'lg',
    paddingRight: 'lg',
    paddingTop: 'lg',
    paddingBottom: 'xl',
    marginTop: {
      mobile: 'pageShellMarginTopMobile',
      desktop: 'pageShellMarginTopDesktop',
    },
    filter: {
      mobile: 'blur',
      desktop: 'none',
    },
    // /* FIXME */
    // scroll-margin-top: 10rem;
  }),
  {
    marginRight: 'auto',
    marginLeft: 'auto',
    maxWidth: tokens.pageShell.maxWidth,
  },
]);
