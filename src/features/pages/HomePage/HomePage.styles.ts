import { css } from '@emotion/react';
import { fadeInUp, fadeInDown, pulseFadeIn } from '../../theme/animations';
import { ThemedStyles } from '../../theme/types';

export const root = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
`;

export const title: ThemedStyles = ({ theme }) => css`
  margin: 0;
  margin-bottom: ${theme.spacing.xxl};
  font-size: 14vw;
  animation: ${fadeInUp};
  animation-duration: 1s;

  @media ${theme.device.mobileL} {
    font-size: ${theme.fontSize['2xl']};
    margin-bottom: ${theme.fontSize.xl};
  }
`;

export const description: ThemedStyles = ({ theme }) => css`
  margin: 0;
  margin-bottom: ${theme.spacing.xxl};
  color: ${theme.colors.heading};
  font-size: 8vw;
  animation: ${fadeInDown};
  animation-duration: 1s;

  @media ${theme.device.mobileL} {
    font-size: ${theme.fontSize.xxl};
    margin-bottom: ${theme.fontSize.xl};
  }
`;

export const navGrid = css`
  opacity: 0;
  animation: ${pulseFadeIn};
  animation-duration: 1s;
  animation-delay: 0.8s;
  animation-fill-mode: forwards;
`;

export const navItem: ThemedStyles = ({ theme }) => css`
  font-size: ${theme.fontSize.lg};
  &:not(:last-child) {
    margin-right: ${theme.spacing.md};
  }

  @media ${theme.device.mobileL} {
    font-size: ${theme.fontSize.xl};
    &:not(:last-child) {
      margin-right: ${theme.spacing.lg};
    }
  }
`;
