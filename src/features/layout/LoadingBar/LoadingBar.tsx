import React, { useEffect } from 'react';
import progress from 'nprogress';
import Router from 'next/router';

const { events: routerEvents } = Router;

progress.configure({
  minimum: 0.1,
  showSpinner: false,
  trickle: true,
  trickleSpeed: 100,
});

export const LoadingBar: React.FunctionComponent = () => {
  const handleRouteChangeStart = () => progress.start();
  const handleRouteChangeComplete = () => progress.done();
  const handleRouteChangeError = () => progress.done();

  useEffect(() => {
    routerEvents.on('routeChangeStart', handleRouteChangeStart);
    routerEvents.on('routeChangeComplete', handleRouteChangeComplete);
    routerEvents.on('routeChangeError', handleRouteChangeError);
    return () => {
      routerEvents.off('routeChangeStart', handleRouteChangeStart);
      routerEvents.off('routeChangeComplete', handleRouteChangeComplete);
      routerEvents.off('routeChangeError', handleRouteChangeError);
    };
  }, []);

  return null;
};
