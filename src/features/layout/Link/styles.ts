import { css } from '@emotion/react';
import type { ThemedStyles } from '../../theme/types';

export const anchor: ThemedStyles = ({ theme }) => css`
  color: ${theme.colors.link};
  transition-property: color, border-color;
  transition-duration: 220ms;
  &:hover {
    color: #ce9178;
  }
`;
