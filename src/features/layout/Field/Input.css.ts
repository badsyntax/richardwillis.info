import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const input = style([
  themeStyle({
    display: 'block',
    padding: 'sm',
  }),
  {
    backgroundColor: 'rgb(41, 41, 41)',
    color: 'rgb(204, 204, 204)',
    border: '1px solid rgb(41, 41, 41)', // FIXME
    width: '100%',
    maxWidth: '100%',
    selectors: {
      '&:focus': {
        borderColor: '#ce9178', // FIXME
        outline: 'none',
      },
    },
    // FIXME
    // @include respond-above(sm) {
    //   width: 16rem;
    // }
  },
]);

export const fullWidth = style({
  width: '100%',
});
