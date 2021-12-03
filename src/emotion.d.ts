import '@emotion/react';
import {
  colors,
  spacing,
  breakpoints,
  fontSize,
  device,
} from './features/theme/designTokens';

declare module '@emotion/react' {
  export interface Theme {
    body: {
      backgroundColor: string;
    };
    colors: typeof colors;
    spacing: typeof spacing;
    breakpoints: typeof breakpoints;
    fontSize: typeof fontSize;
    device: typeof device;
  }
}
