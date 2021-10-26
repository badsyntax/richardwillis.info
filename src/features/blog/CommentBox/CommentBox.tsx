import React, { Fragment } from 'react';

import { getFormattedDateLong } from '../../dates/getFormattedDate';

import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';

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
  proseClassName,
  message,
  children,
  showHeader = true,
  ...props
}) => {
  return (
    <section {...props}>
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
