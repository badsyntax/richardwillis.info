import React from 'react';
import classNames from 'classnames';

import { FieldProps } from './types';
import * as styles from './Input.css';

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> &
  FieldProps;

export const Input: React.FunctionComponent<InputProps> = ({
  className,
  fullWidth,
  ...props
}) => {
  return (
    <input
      className={classNames(
        styles.input,
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    />
  );
};
