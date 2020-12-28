import React from 'react';
import classNames from 'classnames/bind';

import { LinkProps } from '../../layout/Link/Link';
import { Card } from '../../layout/Card/Card';
import { getFormattedDateMedium } from '../../dates/getFormattedDate';

import STYLES from './BlogPostCard.module.css';
const classes = classNames.bind(STYLES);

export interface BlogPostCardProps {
  title: string;
  date: string;
  excerpt?: string;
  className?: string;
  titleClassName?: string;
}

export const BlogPostCard: React.FunctionComponent<
  BlogPostCardProps & LinkProps
> = ({
  title,
  date,
  excerpt,
  children,
  className,
  titleClassName,
  ...props
}) => {
  return (
    <Card className={className} {...props}>
      <Card.Title className={classes(titleClassName)}>{title}</Card.Title>
      <Card.Content className={classes('date')}>
        Posted on {getFormattedDateMedium(new Date(date))}
      </Card.Content>
      {excerpt && <Card.Content>{excerpt}</Card.Content>}
      {children}
    </Card>
  );
};
