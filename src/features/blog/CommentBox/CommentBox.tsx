import React, { Fragment } from 'react';
import classNames from 'classnames/bind';

import { getFormattedDateLong } from '../../dates/getFormattedDate';

import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';

import STYLES from './CommentBox.module.scss';
import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';
const classes = classNames.bind(STYLES);

export type CommentBoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  name?: string;
  date?: Date;
  message?: string;
  showHeader?: boolean;
  proseClassName?: string;
};

export const CommentBox: React.FunctionComponent<CommentBoxProps> = ({
  name,
  date,
  className,
  proseClassName,
  message,
  children,
  showHeader = true,
  ...props
}) => {
  return (
    <section className={classes('root', className)} {...props}>
      {showHeader && (
        <Typography as="h3">
          {name}{' '}
          {date && (
            <Fragment>
              on <Link href="#">{getFormattedDateLong(date)}</Link>
            </Fragment>
          )}
        </Typography>
      )}
      {/* {message && (
        <MarkdownContent
          content={message}
          className={classes('prose', proseClassName)}
        />
      )} */}
      {children}
    </section>
  );
};

export const PreviewCommentBox: React.FunctionComponent<CommentBoxProps> = (
  props
) => {
  return <CommentBox showHeader={false} {...props} />;
};
