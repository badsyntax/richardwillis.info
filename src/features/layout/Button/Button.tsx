import React from 'react';
import classNames from 'classnames';

import { VscSync } from 'react-icons/vsc';

import * as styles from './Button.css';
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter';

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
      className={classNames(
        styles.root,
        // @ts-ignore
        styles[`variant${capitalizeFirstLetter(variant)}`],
        className
      )}
      {...props}>
      {children}
      {isLoading && <VscSync className={classNames('loading-icon')} />}
    </button>
  );
};
