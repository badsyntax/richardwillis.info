import { NextWebVitalsMetric } from 'next/dist/next-server/lib/utils';
import { Vital } from '../../types/types';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  const vital: Vital = {
    path: window.location.pathname,
    metric,
  };
  const body = JSON.stringify(vital);
  const endpointUrl = '/vitals';

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(endpointUrl, blob);
  } else {
    fetch(endpointUrl, {
      body,
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      keepalive: true,
    });
  }
}
