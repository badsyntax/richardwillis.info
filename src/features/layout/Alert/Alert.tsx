import React from 'react';
import classNames from 'classnames/bind';
import { FaExclamationTriangle } from 'react-icons/fa';

import STYLES from './Alert.module.css';
const classes = classNames.bind(STYLES);

export enum AlertSeverity {
  'warn' = 'warn',
  'error' = 'error',
}

export type AlertProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  severity: AlertSeverity;
};

export const Alert: React.FunctionComponent<AlertProps> = ({
  severity,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={classes('root', `variant-${severity}`, className)}
      {...props}
    >
      <FaExclamationTriangle className={classes('icon')} />
      {children}
    </div>
  );
};
