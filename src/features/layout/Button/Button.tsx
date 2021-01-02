import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Button.module.css';
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
      {...props}
    >
      {isLoading && (
        <svg
          className={classes('loading-icon')}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className={classes('loading-icon-circle')}
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className={classes('loading-icon-path')}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
