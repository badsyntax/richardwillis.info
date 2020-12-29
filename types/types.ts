import { NextWebVitalsMetric } from 'next/dist/next-server/lib/utils';

export interface Vital {
  path: string;
  metric: NextWebVitalsMetric;
}
