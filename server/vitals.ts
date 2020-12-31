import { Request, Response } from 'express';
import { Vital } from '../types/types';
import { ttfbHistogram } from './metrics/client';

export const vitalsHandler = (
  req: Request,
  res: Response
): Response<string> => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).send('Invalid content-type');
  }
  const vital = req.body as Vital;
  switch (vital.metric.name) {
    case 'TTFB': {
      ttfbHistogram.observe(
        {
          path: vital.path,
        },
        vital.metric.value
      );
      break;
    }
    default:
      break;
  }
  return res.status(200).send('ok');
};
