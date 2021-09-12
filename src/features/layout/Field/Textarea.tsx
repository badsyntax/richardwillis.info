import React from 'react';
import classNames from 'classnames/bind';

import { FieldProps } from './types';
import STYLES from './Styles.module.scss';
const classes = classNames.bind(STYLES);

export type TextareaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> &
  FieldProps;

export const Textarea: React.FunctionComponent<TextareaProps> = ({
  className,
  fullWidth = false,
  ...props
}) => {
  return (
    <textarea
      className={classes('text-field', fullWidth && 'full-width', className)}
      {...props}
    ></textarea>
  );
};
