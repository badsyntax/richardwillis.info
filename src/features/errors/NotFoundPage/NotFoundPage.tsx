import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';
import { Link } from '../../layout/Link/Link';

import STYLES from './NotFoundPage.module.scss';
const classes = classNames.bind(STYLES);

export const NotFoundPage: React.FC = () => {
  return (
    <PageShell
      title="404 Not Found"
      description="This page could not be found."
    >
      <Typography as="div" variant="prose" className={classes('content')}>
        <h1>404 Not Found</h1>
        <p>
          <Link href="/">Return Home</Link>
        </p>
      </Typography>
    </PageShell>
  );
};
