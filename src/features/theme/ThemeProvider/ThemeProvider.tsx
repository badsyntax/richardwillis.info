import React from 'react';
import { Global, ThemeProvider as EmotionThemeProvider } from '@emotion/react';

import 'modern-normalize';
import 'prism-themes/themes/prism-vsc-dark-plus.css';

import { globalStyles } from '../globalStyles';
import { darkTheme } from '../theme';

export const ThemeProvider: React.FC = ({ children }) => {
  return (
    <EmotionThemeProvider theme={darkTheme}>
      <Global styles={globalStyles} />
      {children}
    </EmotionThemeProvider>
  );
};
