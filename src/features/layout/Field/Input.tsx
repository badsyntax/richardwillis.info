import React from 'react';
import classNames from 'classnames/bind';

import { FieldProps } from './types';
import STYLES from './Styles.module.css';
const classes = classNames.bind(STYLES);

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
      className={classes('text-field', fullWidth && 'full-width', className)}
      {...props}
    />
  );
};
