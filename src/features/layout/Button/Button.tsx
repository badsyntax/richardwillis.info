import React from 'react';
import classNames from 'classnames/bind';

import { VscSync } from 'react-icons/vsc';

import STYLES from './Button.module.scss';
const classes = classNames.bind(STYLES);

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: 'default' | 'card';
  isLoading?: boolean;
};

export const Button: React.FunctionComponent<ButtonProps> = ({
  className,
  variant = 'default',
  children,
  isLoading = false,
  ...props
}) => {
  return (
    <button
      className={classes('root', `variant-${variant}`, className)}
      {...props}>
      {children}
      {isLoading && <VscSync className={classes('loading-icon')} />}
    </button>
  );
};
