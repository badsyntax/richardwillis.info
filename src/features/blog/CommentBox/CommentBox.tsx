import React, { Fragment } from 'react';
import classNames from 'classnames/bind';

import { getFormattedDateLong } from '../../dates/getFormattedDate';

import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';

import STYLES from './CommentBox.module.scss';
import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';
import { Comment } from '../../api/strapi';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { CommentWithMdxSource } from '../types';
const classes = classNames.bind(STYLES);

export type CommentBoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  comment?: CommentWithMdxSource;
  showHeader?: boolean;
  proseClassName?: string;
};

export const CommentBox: React.FC<CommentBoxProps> = ({
  className,
  proseClassName,
  children,
  comment,
  showHeader = true,
  ...props
}) => {
  // console.log('comment', comment?.created_at);
  return (
    <section className={classes('root', className)} {...props}>
      {showHeader && (
        <Typography as="h3" variant="h4">
          {comment?.author}{' '}
          {comment?.createdAt && (
            <Fragment>
              on{' '}
              <Link href="#">
                {getFormattedDateLong(new Date(comment.createdAt))}
              </Link>
            </Fragment>
          )}
        </Typography>
      )}
      {comment && (
        <MarkdownContent
          mdxSource={comment.mdxSource}
          className={classes('root')}
        />
      )}
      {children}
    </section>
  );
};

export const PreviewCommentBox: React.FunctionComponent<CommentBoxProps> = (
  props
) => {
  return <CommentBox showHeader={false} {...props} />;
};
