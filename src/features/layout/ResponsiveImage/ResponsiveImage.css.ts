// @import '../../../styles/theme';

import { globalStyle, style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const root = style([
  themeStyle({
    display: 'block',
    marginBottom: 'lg',
  }),
  {
    border: '1px solid #333', // FIXME
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'auto',
    maxWidth: '92%',
    selectors: {
      '&:hover': {
        borderColor: '#ce9178', // FIXME
      },
    },
    // FIXME
    //   @include respond-above(md) {
    //     max-width: 72%;
    //   }
  },
]);

export const fullWidth = style({
  maxWidth: '100%',
  // FIXME
  // @include respond-above(md) {
  //       max-width: 100%;
  //     }
});

globalStyle(`${root} img`, {
  maxWidth: '100%',
});

// .root {

//

//   img {
//     max-width: 100%;
//   }

//   &.full-width {
//     max-width: 100%;
//     @include respond-above(md) {
//       max-width: 100%;
//     }
//   }
// }
