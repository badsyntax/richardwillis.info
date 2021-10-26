import { keyframes, style } from '@vanilla-extract/css';
import { themeStyle } from '../../../styles/theme.css';

export const root = themeStyle({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const variantDefault = style([
  themeStyle({
    paddingY: 'sm',
    paddingX: 'lg',
  }),
  {
    cursor: 'pointer',
    color: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(14, 99, 156)',
    border: '1px solid rgb(14, 99, 156)',
    selectors: {
      '&:hover': {
        backgroundColor: 'rgb(17, 119, 187)',
      },
      '&:focus': {
        borderColor: '#ce9178',
      },
    },
  },
]);

const spin = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
});

export const loadingIcon = style([
  themeStyle({
    marginLeft: 'sm',
  }),
  {
    animationName: spin,
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
]);
