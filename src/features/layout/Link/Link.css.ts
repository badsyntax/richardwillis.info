import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const root = style([
  themeStyle({
    color: {
      default: 'link',
      hover: 'heading',
    },
  }),
  {
    transitionProperty: 'color, border-color',
    transitionDuration: '220ms',
  },
]);
