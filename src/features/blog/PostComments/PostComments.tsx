import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { Typography } from '../../layout/Typography/Typography';

import { AddCommentForm } from '../AddCommentForm/AddCommentForm';

// import { FaInfo } from 'react-icons/fa';
// import { InfoIcon } from '../../layout/Icons/InfoIcon';

import { CommentBox } from '../CommentBox/CommentBox';

// @ts-expect-error
function classes(...args) {
  return '';
}

type PostComment = {
  author: string;
};

export interface PostCommentsProps {
  comments: PostComment[];
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
        {/* {comments.map((comment) => (
          <CommentBox
            // key={comment.id}
            name={comment.author}
            // date={new Date(comment.date * 1000)}
            // message={comment.messageHtml}
          />
        ))} */}
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
