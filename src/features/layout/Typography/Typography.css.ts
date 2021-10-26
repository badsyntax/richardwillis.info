import { globalStyle, style } from '@vanilla-extract/css';
import { theme, themeStyle } from '../../../styles/theme.css';

export const root = themeStyle({
  color: 'text',
  // 'font-family': $theme-font-family;'
});

// .variant-h1 {
//   @extend %theme-h1;
// }

const typeSpacing = themeStyle({
  marginBottom: {
    mobile: 'lg',
    desktop: 'xl',
  },
});

const headerSpacing = style([
  typeSpacing,
  themeStyle({
    marginTop: {
      mobile: 'lg',
      desktop: 'xl',
    },
  }),
]);

// export const linkStyle = style({
//   color: {
//     default: 'link',
//     hover: 'linkHover',
//   },
// });

export const variantH1 = style([
  headerSpacing,
  themeStyle({
    fontSize: {
      mobile: 'xl',
      desktop: 'xxl',
    },
    lineHeight: {
      mobile: 'baseH1',
      desktop: 'mdH1',
    },
  }),
]);

export const variantH2 = style([
  headerSpacing,
  themeStyle({
    fontSize: {
      mobile: 'lg',
      desktop: 'xl',
    },
    lineHeight: {
      mobile: 'xl',
      desktop: 'xxl',
    },
  }),
]);

export const variantH3 = style([
  headerSpacing,
  themeStyle({
    fontSize: {
      mobile: 'md',
      desktop: 'lg',
    },
    lineHeight: {
      mobile: 'lg',
      desktop: 'xl',
    },
  }),
]);

export const variantP = style([
  typeSpacing,
  themeStyle({
    fontSize: {
      mobile: 'base',
      desktop: 'md',
    },
    lineHeight: {
      mobile: 'baseP',
      desktop: 'mdP',
    },
  }),
]);

export const variantHr = style([
  themeStyle({
    marginBottom: {
      mobile: 'lg',
      desktop: 'xl',
    },
    marginTop: {
      desktop: 'xl',
    },
  }),
  {
    display: 'block',
    height: '1px',
    border: 0,
    borderTop: '1px solid #333',
    padding: 0,
  },
]);

globalStyle(`${variantHr} + *`, {
  marginTop: 0,
});

export const variantProse = style([
  themeStyle({
    fontSize: 'md',
  }),
  {
    lineHeight: '1.8',
    selectors: {
      // '& a': {
      //   color: 'black',
      // },
    },
  },
]);

globalStyle(`${variantProse} > :first-child:not(hr)`, {
  marginTop: 0,
});

// globalStyle(`${variantProse} a`, [variantA]);

//   a: {
//     // @extend %theme-link;
//   },

//   h1: {
//     // @extend %theme-h1;
//   },

//   h2: {
//     // @extend %theme-h2;
//   },

//   h3: {
//     // @extend %theme-h3;
//   },

//   p: {
//     // @extend .variant-p;
//   },

//   hr: {
//     // @extend %theme-hr;
//   },

//   'ul, ol': {
//     // @extend %theme-list;
//   },

//   // 'ul, ol': {
//   //   // '> li': {
//   //   //   // @extend %theme-list-item;
//   //   // }
//   // },

//   code: {
//     backgroundColor: '#333',
//     padding: '1px 4px',
//   },

//   // details {
//   //   summary {
//   //     cursor: pointer;
//   //   }
//   // }

//   // pre {
//   //   @include scrollbar;
//   //   @include spacing;

//   //   code {
//   //     background-color: transparent;
//   //     border-width: 0;
//   //     border-radius: 0;
//   //     padding: 0;
//   //     font-weight: 400;
//   //     color: inherit;
//   //   }
//   // }

//   // pre[class*='language-'],
//   // code[class*='language-'] {
//   //   font-size: $theme-font-size-base;
//   //   cursor: text;
//   // }

//   // pre[class*='language-'] {
//   //   border-color: #333;
//   //   border-width: 1px;
//   //   border-style: solid;
//   //   padding: $theme-spacing-md;
//   //   background: rgb(26, 26, 26);
//   //   transition-property: border-color;
//   //   transition-duration: 260ms;
//   //   &:hover {
//   //     border-color: #444;
//   //   }
//   // }

//   // img {
//   //   display: block;
//   //   height: auto;
//   //   max-width: 100%;
//   // }
// },
