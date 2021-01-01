import { Request, Response } from 'express';

import { registry } from '../metrics/client';

export const metricsHandler = async (
  _: Request,
  res: Response
): Promise<void> => {
  res.type(registry.contentType);
  res.send(await registry.metrics());
};
