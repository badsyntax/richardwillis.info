import React from 'react';
import classNames from 'classnames';

import { FieldProps } from './types';
import * as styles from './Input.css';

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
      className={classNames(
        styles.input,
        fullWidth && styles.fullWidth,
        className
      )}
      {...props}
    />
  );
};
