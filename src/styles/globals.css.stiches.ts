import { globalCss } from '@stitches/react';
import { theme } from './stitches.config';
import { normalizeCss } from './modern-normalise.css';

export const globalStyles = globalCss({
  ...normalizeCss,
  'html, body': { height: '100%' },
  body: {
    backgroundColor: theme.colors.background,
  },
  'body > div': {
    height: '100%',
  },
  '.mobile-nav-open .body': {
    overflow: 'hidden',
  },
  'ul, ol, blockquote, dd, dl, figure, h1, h2, h3, h4, h5, h6, hr, p, pre': {
    margin: 0,
  },
});
