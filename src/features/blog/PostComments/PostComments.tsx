import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { Typography } from '../../layout/Typography/Typography';

import { Button } from '../../layout/Button/Button';
import { Link } from '../../layout/Link/Link';
import { CommentBox } from '../../layout/CommentBox/CommentBox';
import { PostComment } from '../types';
import { AddCommentForm } from '../AddCommentForm/AddCommentForm';

import STYLES from './PostComments.module.css';
const classes = classNames.bind(STYLES);

export interface PostCommentsProps {
  comments: PostComment[];
}

export const PostComments: React.FunctionComponent<PostCommentsProps> = ({
  comments,
}) => {
  return (
    <Fragment>
      <hr className={classes('hr')} />
      <Typography as="h2" className={classes('heading')}>
        Comments
      </Typography>
      {comments.map((comment) => (
        <CommentBox
          key={comment._id}
          author={comment.author}
          date={new Date(comment.date * 1000)}
          message={comment.messageHtml}
        />
      ))}
      <AddCommentForm />
    </Fragment>
  );
};
