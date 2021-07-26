// import DateFormatter from '../components/date-formatter';
import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { PostTitle } from '../PostTitle/PostTitle';
import { Author } from '../types';
import STYLES from './PostHeader.module.scss';
import { getFormattedDateLong } from '../../dates/getFormattedDate';
import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';
const classes = classNames.bind(STYLES);

interface PostHeaderProps {
  title: string;
  date: string;
  author: Author;
}

export const PostHeader: React.FC<PostHeaderProps> = ({ title, date }) => {
  return (
    <Typography as="div" variant="prose">
      <h1>{title}</h1>
      <div className={classes('date')}>
        Posted on: {getFormattedDateLong(new Date(date))}
      </div>
      <Link href="/blog" className={classes('back-link')}>
        &larr;&nbsp;Back to the Blog
      </Link>
    </Typography>
  );
};
