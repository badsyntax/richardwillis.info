import React from 'react';
import { getFormattedDateLong } from '../../dates/getFormattedDate';
import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';

import * as styles from './PostHeader.css';

interface PostHeaderProps {
  title: string;
  date: string;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, date }) => {
  return (
    <>
      <Typography as="h1" className={styles.title}>
        {title}
      </Typography>
      <Typography as="div" className={styles.date}>
        Posted on: {getFormattedDateLong(new Date(date))}
      </Typography>
      <Typography as="div">
        <Link href="/blog" className={styles.backLink}>
          &larr;&nbsp;Back to the Blog
        </Link>
      </Typography>
    </>
  );
};
