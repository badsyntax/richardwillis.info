import React from 'react';
import classNames from 'classnames/bind';

import { Link, LinkProps } from '../Link/Link';
import { Typography, TypographyProps } from '../Typography/Typography';

import STYLES from './Card.module.scss';
const classes = classNames.bind(STYLES);

export type CardTitleType = React.FC<TypographyProps>;

export const CardTitle: CardTitleType = ({ children, className, ...props }) => {
  return (
    <Typography as="h2" {...props} className={classes('title', className)}>
      {children}
    </Typography>
  );
};

export type CardContentType = React.FC<TypographyProps>;

export const CardContent: CardContentType = ({ className, ...props }) => {
  return (
    <Typography as="p" {...props} className={classes('content', className)} />
  );
};

export type CardProps = {
  className?: string;
} & LinkProps;

export type CardType = React.FC<CardProps> & {
  Title: CardTitleType;
  Content: CardContentType;
};

export const Card: CardType = ({ children, className, ...props }) => {
  return (
    <Link
      className={classes('card', className)}
      variant="card-button"
      {...props}
    >
      {children}
    </Link>
  );
};

Card.Title = CardTitle;
Card.Content = CardContent;
