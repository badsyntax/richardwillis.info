import { NextWebVitalsMetric } from 'next/dist/next-server/lib/utils';
import { recordVitalMetric } from './vitalsClient';

export function reportWebVitals(metric: NextWebVitalsMetric): void {
  recordVitalMetric({
    path: window.location.pathname,
    metric,
  });
}
