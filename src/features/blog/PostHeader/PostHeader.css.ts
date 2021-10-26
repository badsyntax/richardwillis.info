import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const title = style([
  themeStyle({
    marginBottom: 'md',
  }),
  {
    marginTop: 0,
  },
]);

export const date = themeStyle({
  marginBottom: 'lg',
});

export const backLink = themeStyle({
  marginBottom: 'lg',
});
