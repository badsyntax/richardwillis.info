import { NextWebVitalsMetric } from 'next/dist/next-server/lib/utils';

export interface VitalsMetric {
  path: string;
  metric: NextWebVitalsMetric;
}
