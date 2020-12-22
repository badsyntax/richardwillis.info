import React from 'react';
import classNames from 'classnames/bind';

import { Link, LinkProps } from '../Link/Link';
import STYLES from './Card.module.css';
const classes = classNames.bind(STYLES);

export type CardProps = {
  className?: string;
} & LinkProps;

export const Card: React.FunctionComponent<CardProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Link className={classes('card', className)} {...props}>
      {children}
    </Link>
  );
};
