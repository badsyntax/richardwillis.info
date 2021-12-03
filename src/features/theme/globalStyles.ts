import { css, SerializedStyles, Theme } from '@emotion/react';

export const globalStyles = (theme: Theme): SerializedStyles => css`
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html,
  body {
    height: 100%;
  }

  body {
    background-color: ${theme.body.backgroundColor};
    /* @include scrollbar(14px); */

    > div {
      height: 100%;
    }

    .mobile-nav-open & {
      overflow: hidden;
    }
  }

  ul,
  ol,
  blockquote,
  dd,
  dl,
  figure,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  p,
  pre {
    margin: 0;
  }
`;
