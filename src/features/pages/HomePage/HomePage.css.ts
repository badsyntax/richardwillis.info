import { keyframes, style } from '@vanilla-extract/css';
import { theme, themeStyle } from '../../../styles/theme.css';

const fadeInUp = keyframes({
  '0%': { opacity: 0, transform: 'translate3d(0, 100%, 0)' },
  '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
});

const fadeInDown = keyframes({
  '0%': { opacity: 0, transform: 'translate3d(0, -100%, 0)' },
  '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
});

const pulseFadeIn = keyframes({
  '0%': { opacity: 0, transform: 'scale3d(1, 1, 1)' },
  '50%': { transform: 'scale3d(1.15, 1.15, 1.15)' },
  '100%': { opacity: 1, transform: 'scale3d(1, 1, 1)' },
});

export const root = style({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100%',
});

export const title = style([
  themeStyle({
    marginBottom: {
      mobile: 'xxl',
      desktop: 'xl',
    },
    fontSize: {
      mobile: 'home-title-mobile',
      desktop: 'home-title-desktop',
    },
  }),
  {
    animation: fadeInUp,
    animationDuration: '1s',
    marginTop: 0,
  },
]);

export const description = style([
  themeStyle({
    marginBottom: {
      desktop: 'xl',
      mobile: 'xxl',
    },
    color: 'heading',
    fontSize: {
      desktop: 'home-description-desktop',
      mobile: 'home-description-mobile',
    },
  }),
  {
    animationName: fadeInDown,
    animationDuration: '1s',
    marginTop: 0,
  },
]);

export const navGrid = style([
  themeStyle({}),
  {
    opacity: 0,
    animationName: pulseFadeIn,
    animationDuration: '1s',
    animationDelay: '0.8s',
    animationFillMode: 'forwards',
  },
]);

export const navItem = style([
  themeStyle({
    fontSize: {
      mobile: 'lg',
      desktop: 'xl',
    },
    marginRight: {
      mobile: 'md',
      desktop: 'lg',
    },
  }),
  {
    selectors: {
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
]);
