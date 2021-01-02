import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { FaInfo } from 'react-icons/fa';
import { Typography } from '../../layout/Typography/Typography';

import { CommentBox } from '../../layout/CommentBox/CommentBox';
import { PostComment } from '../types';
import { AddCommentForm } from '../AddCommentForm/AddCommentForm';

import STYLES from './PostComments.module.css';
import { InfoIcon } from '../../layout/Icons/InfoIcon';
const classes = classNames.bind(STYLES);

export interface PostCommentsProps {
  comments: PostComment[];
  slug: string;
}

export const PostComments: React.FunctionComponent<PostCommentsProps> = ({
  comments,
  slug,
}) => {
  return (
    <Fragment>
      <hr className={classes('hr')} />
      <Typography as="h2" className={classes('heading')}>
        Comments
      </Typography>
      <div className={classes('comments')}>
        {comments.map((comment) => (
          <CommentBox
            key={comment._id}
            name={comment.name}
            date={new Date(comment.date * 1000)}
            message={comment.messageHtml}
          />
        ))}
        {!comments.length && (
          <CommentBox showHeader={false} className={classes('no-comments')}>
            {/* <FaInfo className={classes('icon')} /> */}
            {/* <InfoIcon className={classes('icon')} /> */}
            No comments
          </CommentBox>
        )}
      </div>
      <AddCommentForm slug={slug} />
    </Fragment>
  );
};
