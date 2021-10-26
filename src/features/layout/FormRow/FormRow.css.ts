import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const root = style([
  themeStyle({
    marginBottom: 'lg',
  }),
  {
    selectors: {
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
]);
