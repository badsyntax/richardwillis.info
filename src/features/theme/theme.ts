import type { Theme } from '@emotion/react';
import { breakpoints, colors, fontSize, spacing, device } from './designTokens';

export const darkTheme: Theme = {
  body: {
    backgroundColor: colors.background,
  },
  colors,
  breakpoints,
  spacing,
  fontSize,
  device,
};

export const lightTheme: Theme = {
  ...darkTheme,
};
