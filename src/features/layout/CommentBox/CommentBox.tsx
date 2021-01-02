import React from 'react';
import classNames from 'classnames/bind';

import { Typography } from '../Typography/Typography';
import { getFormattedDateLong } from '../../dates/getFormattedDate';

import STYLES from './CommentBox.module.css';
import { Link } from '../Link/Link';
import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';
const classes = classNames.bind(STYLES);

export type CommentBoxProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  name?: string;
  date?: Date;
  message: string;
  showHeader?: boolean;
  proseClassName?: string;
};

export const CommentBox: React.FunctionComponent<CommentBoxProps> = ({
  name,
  date,
  className,
  proseClassName,
  message,
  showHeader = true,
  ...props
}) => {
  return (
    <section className={classes('root', className)} {...props}>
      {showHeader && (
        <Typography as="h3" className={classes('name')}>
          {name} on <Link href="#">{getFormattedDateLong(date)}</Link>
        </Typography>
      )}
      <MarkdownContent
        content={message}
        className={classes('prose', proseClassName)}
      />
    </section>
  );
};
