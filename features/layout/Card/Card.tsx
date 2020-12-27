import React from 'react';
import classNames from 'classnames/bind';

import { Link, LinkProps } from '../Link/Link';
import { Typography, TypographyProps } from '../Typography/Typography';
import STYLES from './Card.module.css';
const classes = classNames.bind(STYLES);

export type CardTitleType = React.FunctionComponent<TypographyProps>;

export const CardTitle: CardTitleType = ({ children, className, ...props }) => {
  return (
    <Typography as="h3" {...props} className={classes('title', className)}>
      {children}&nbsp;&rarr;
    </Typography>
  );
};

export type CardContentType = React.FunctionComponent<TypographyProps>;

export const CardContent: CardContentType = ({ className, ...props }) => {
  return (
    <Typography as="p" {...props} className={classes('content', className)} />
  );
};

export type CardProps = {
  className?: string;
} & LinkProps;

export type CardType = React.FunctionComponent<CardProps> & {
  Title: CardTitleType;
  Content: CardContentType;
};

export const Card: CardType = ({ children, className, ...props }) => {
  return (
    <Link className={classes('card', className)} variant="button" {...props}>
      {children}
    </Link>
  );
};

Card.Title = CardTitle;
Card.Content = CardContent;
