import { style, composeStyles } from '@vanilla-extract/css';
import { atoms, space } from '../../../styles/sprinkles.css';
export const container = atoms({
  display: 'flex',
  paddingX: 'sm',

  // Conditional atoms:
  // flexDirection: {
  // mobile: 'column',
  // desktop: 'row',
  // },
});

export const main = style({
  marginRight: 'auto',
  marginLeft: 'auto',
  paddingLeft: space.lg,
  paddingRight: space.lg,
  paddingTop: space.md,
  paddingBottom: space.xl,
  // margin-right: auto;
  // margin-left: auto;
  // /* FIXME */
  // scroll-margin-top: 10rem;
  // padding-left: $theme-spacing-lg;
  // padding-right: $theme-spacing-lg;
  // padding-top: $theme-spacing-md * 6;
  // padding-bottom: $theme-spacing-xl;
});
