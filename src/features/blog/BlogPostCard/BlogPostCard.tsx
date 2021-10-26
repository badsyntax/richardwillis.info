import React from 'react';
import classNames from 'classnames/bind';

import { LinkProps } from '../../layout/Link/Link';
import { Card } from '../../layout/Card/Card';
import { getFormattedDateMedium } from '../../dates/getFormattedDate';

import * as styles from './BlogPostCard.css';

export interface BlogPostCardProps {
  title: string;
  date: string;
  excerpt?: string;
  className?: string;
  titleClassName?: string;
}

export const BlogPostCard: React.FC<BlogPostCardProps & LinkProps> = ({
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
      <Card.Title className={classNames(titleClassName)}>{title}</Card.Title>
      <Card.Content className={styles.date}>
        Posted on {getFormattedDateMedium(new Date(date))}
      </Card.Content>
      {excerpt && <Card.Content>{excerpt}</Card.Content>}
      {children}
    </Card>
  );
};
