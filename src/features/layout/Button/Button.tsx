import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Button.module.css';
const classes = classNames.bind(STYLES);

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  className?: string;
  variant?: 'default' | 'card';
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  className,
  variant = 'default',
  ...props
}) => {
  return (
    <button className={classes(`variant-${variant}`, className)} {...props} />
  );
};
