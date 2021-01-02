import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './FormRow.module.css';
const classes = classNames.bind(STYLES);

export type FormRowProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const FormRow: React.FunctionComponent<FormRowProps> = ({
  className,
  ...props
}) => {
  return <div className={classes('root', className)} {...props} />;
};
