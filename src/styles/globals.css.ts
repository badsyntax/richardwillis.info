import { globalStyle } from '@vanilla-extract/css';

import './modern-normalise.css';
import { theme } from './theme.css';

// globalStyle({
//   boxSizing: 'border-box',
// });

// @import 'node_modules/modern-normalize/modern-normalize';
// @import './theme';

globalStyle('html, body', {
  height: '100%',
});

globalStyle('body', {
  backgroundColor: theme.color.background,
  // @include scrollbar(14px);
});

globalStyle('body > div', {
  height: '100%',
});

globalStyle('.mobile-nav-open .body', {
  overflow: 'hidden',
});

globalStyle('.mobile-nav-open .body', {
  overflow: 'hidden',
});

globalStyle(
  'ul, ol, blockquote, dd, dl, figure, h1, h2, h3, h4, h5, h6, hr, p, pre',
  {
    margin: 0,
  }
);
