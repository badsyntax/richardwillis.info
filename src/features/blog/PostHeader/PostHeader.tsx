// import DateFormatter from '../components/date-formatter';
import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { PostTitle } from '../PostTitle/PostTitle';
import { Author } from '../types';
import STYLES from './PostHeader.module.css';
import { getFormattedDateLong } from '../../dates/getFormattedDate';
import { Link } from '../../layout/Link/Link';
const classes = classNames.bind(STYLES);

interface PostHeaderProps {
  title: string;
  date: string;
  author: Author;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const PostHeader: React.FunctionComponent<PostHeaderProps> = ({
  title,
  date,
  isEditing,
  setIsEditing,
}) => {
  const onEditButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };
  const onViewButtonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsEditing(false);
  };
  return (
    <Fragment>
      <PostTitle>{title}</PostTitle>
      <div className={classes('date')}>
        Posted on: {getFormattedDateLong(new Date(date))}
      </div>
      <div className={classes('page-actions')}>
        <Link href="/blog" className={classes('action-link')}>
          &larr;&nbsp;Back to the Blog
        </Link>
        <div className={classes('edit-preview')}>
          {isEditing ? (
            <Link
              href="#"
              className={classes('action-link')}
              onClick={onViewButtonClick}
            >
              View
            </Link>
          ) : (
            <Link
              href="#"
              className={classes('action-link')}
              onClick={onEditButtonClick}
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </Fragment>
  );
};
