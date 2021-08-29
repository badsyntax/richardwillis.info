// import DateFormatter from '../components/date-formatter';
import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { PostTitle } from '../PostTitle/PostTitle';
import { Author } from '../types';
import { getFormattedDateLong } from '../../dates/getFormattedDate';
import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';

import STYLES from './PostHeader.module.scss';
const classes = classNames.bind(STYLES);

interface PostHeaderProps {
  title: string;
  date: string;
  author: Author;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, date }) => {
  return (
    <>
      <Typography as="h1" className={classes('title')}>
        {title}
      </Typography>
      <Typography as="div" className={classes('date')}>
        Posted on: {getFormattedDateLong(new Date(date))}
      </Typography>
      <Typography as="div">
        <Link href="/blog" className={classes('back-link')}>
          &larr;&nbsp;Back to the Blog
        </Link>
      </Typography>
    </>
  );
};
