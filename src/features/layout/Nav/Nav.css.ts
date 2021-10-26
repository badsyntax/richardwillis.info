import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const root = themeStyle({
  display: 'flex',
});

export const navItem = style([
  themeStyle({
    paddingX: 'lg',
    paddingY: 'sm',
  }),
  {
    textDecoration: 'none',
  },
]);

export const active = themeStyle({
  color: 'tags',
});

// @import '../../../styles/theme';

// .root {
//   display: flex;
// }

// .nav-item {
//   padding: $theme-spacing-sm $theme-spacing-lg;
//   text-decoration: none;
// }

// .active {
//   color: rgb(115, 201, 145);
// }
