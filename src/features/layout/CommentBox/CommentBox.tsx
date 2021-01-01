import React from 'react';
import classNames from 'classnames/bind';

import { Typography } from '../Typography/Typography';
import { getFormattedDateLong } from '../../dates/getFormattedDate';

import STYLES from './CommentBox.module.css';
import { Link } from '../Link/Link';
import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';
const classes = classNames.bind(STYLES);

export interface CommentBoxProps {
  author?: string;
  date?: Date;
  className?: string;
  message: string;
  showHeader?: boolean;
}

export const CommentBox: React.FunctionComponent<CommentBoxProps> = ({
  author,
  date,
  className,
  message,
  showHeader = true,
}) => {
  return (
    <section className={classes('root', className)}>
      {showHeader && (
        <Typography as="h3" className={classes('author')}>
          {author} on <Link href="#">{getFormattedDateLong(date)}</Link>
        </Typography>
      )}
      <MarkdownContent content={message} />
    </section>
  );
};
