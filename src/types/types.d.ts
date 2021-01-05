import { NextWebVitalsMetric } from 'next/dist/next-server/lib/utils';

export interface VitalsMetric {
  path: string;
  metric: NextWebVitalsMetric;
}

export interface Repo {
  name: string;
  stars: number;
}
