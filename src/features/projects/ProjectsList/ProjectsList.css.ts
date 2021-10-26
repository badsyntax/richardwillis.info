// // @import '../../../styles/theme';

import { style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const root = themeStyle({
  marginTop: 'xl',
});

export const tags = style([
  themeStyle({
    color: 'tags',
  }),
  {
    marginBottom: 0,
  },
]);

export const card = style([]);

export const title = style([]);

export const footer = style([]);

export const stars = style([]);

// .card {
//   // @apply my-3
//   //   sm:my-4;
// }

// .footer-content {
//   // @apply text-gray-500;
// }

// .title {
//   // color: $theme-link-color;
//   // margin-bottom: $theme-spacing-md;
// }

// .github-icon {
//   // @apply mr-2
//   //   sm:mr-4
//   //   text-xl
//   //   sm:text-3xl;
// }

// .footer {
//   // @apply flex
//   //   justify-between
//   //   items-center;
// }

// .stars {
//   // @apply flex
//   //   flex-row
//   //   items-center;
//   // composes: footer-content;
// }

// .star-icon {
//   // @apply text-base
//   //   sm:text-lg
//   //   mr-1;
//   // composes: footer-content;
// }

// .star-text {
//   // @apply text-sm
//   //   sm:text-base;
// }
