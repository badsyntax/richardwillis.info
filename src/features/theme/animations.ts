import { keyframes } from '@emotion/react';

export const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const fadeInDown = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const pulseFadeIn = keyframes`
  0% {
    transform: scale3d(1, 1, 1);
    opacity: 0;
  }
  50% {
    transform: scale3d(1.15, 1.15, 1.15);
  }
  100% {
    transform: scale3d(1, 1, 1);
    opacity: 1;
  }
`;
