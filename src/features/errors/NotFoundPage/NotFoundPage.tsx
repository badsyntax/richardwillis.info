import React from 'react';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';
import { Link } from '../../layout/Link/Link';

export const NotFoundPage: React.FC = () => {
  return (
    <PageShell
      title="404 Not Found"
      description="This page could not be found.">
      <Typography as="div" variant="prose">
        <h1>404 Not Found</h1>
        <p>
          <Link href="/">Return Home</Link>
        </p>
      </Typography>
    </PageShell>
  );
};
