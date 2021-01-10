import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './DialogButton.module.css';
const classes = classNames.bind(STYLES);

export type DialogButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const DialogButton: React.FunctionComponent<DialogButtonProps> = ({
  className,
  ...props
}) => {
  return <button className={classes('root', className)} {...props} />;
};
