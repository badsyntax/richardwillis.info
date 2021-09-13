import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { Typography } from '../../layout/Typography/Typography';

import { AddCommentForm } from '../AddCommentForm/AddCommentForm';

// import { FaInfo } from 'react-icons/fa';
// import { InfoIcon } from '../../layout/Icons/InfoIcon';

import STYLES from './PostComments.module.scss';
import { CommentBox } from '../CommentBox/CommentBox';
import { Comment } from '../../api/strapi';
import { CommentWithMdxSource } from '../types';
const classes = classNames.bind(STYLES);

export interface PostCommentsProps {
  comments: CommentWithMdxSource[];
  articleId: string;
}

export const PostComments: React.FunctionComponent<PostCommentsProps> = ({
  comments,
  articleId,
}) => {
  return (
    <Fragment>
      <Typography as="hr" className={classes('hr')} />
      <Typography as="h2" className={classes('heading')}>
        Comments
      </Typography>
      <div className={classes('comments')}>
        {comments.map((comment) => (
          <CommentBox key={comment.id} comment={comment} />
        ))}
        {!comments.length && (
          <CommentBox showHeader={false} className={classes('no-comments')}>
            {/* <FaInfo className={classes('icon')} /> */}
            {/* <InfoIcon className={classes('icon')} /> */}
            <Typography as="div" variant="prose">
              <p>(No comments)</p>
            </Typography>
          </CommentBox>
        )}
      </div>
      <AddCommentForm articleId={articleId} />
    </Fragment>
  );
};
