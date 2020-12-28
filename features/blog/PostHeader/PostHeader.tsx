// import DateFormatter from '../components/date-formatter';
import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { PostTitle } from '../PostTitle/PostTitle';
import { Author } from '../types';
import STYLES from './PostHeader.module.css';
import { Box } from '../../layout/Box/Box';
import { getFormattedDateLong } from '../../dates/getFormattedDate';
const classes = classNames.bind(STYLES);

interface PostHeaderProps {
  title: string;
  date: string;
  author: Author;
}

export const PostHeader: React.FunctionComponent<PostHeaderProps> = ({
  title,
  date,
}) => {
  return (
    <Fragment>
      <PostTitle>{title}</PostTitle>
      <div className={classes('date')}>
        Posted on: {getFormattedDateLong(new Date(date))}
      </div>
    </Fragment>
  );
};
