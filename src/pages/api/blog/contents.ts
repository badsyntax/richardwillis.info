import type { NextApiRequest, NextApiResponse } from 'next';
import { getContentsForSlug } from '../../../features/blog/api';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string>
): Promise<void> => {
  const { method } = req;
  console.log('METHOD', method);
  switch (method) {
    case 'POST': {
      const slug = req.query.slug;
      if (Array.isArray(slug)) {
        return res.status(400).end('invalid slug');
      }
      const contents = getContentsForSlug(slug);
      res.status(200).send(contents);
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};
