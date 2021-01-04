import React from 'react';
import classNames from 'classnames/bind';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

import STYLES from './Alert.module.css';
const classes = classNames.bind(STYLES);

export enum AlertSeverity {
  'warn' = 'warn',
  'error' = 'error',
  'success' = 'success',
}

function getIcon(severity: AlertSeverity): React.ElementType {
  switch (severity) {
    case AlertSeverity.error:
      return FaExclamationTriangle;
    case AlertSeverity.success:
      return FaCheck;
    default:
      throw new Error('No icon');
  }
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
  const Icon = getIcon(severity);
  return (
    <div
      className={classes('root', `variant-${severity}`, className)}
      {...props}
    >
      <Icon className={classes('icon')} />
      {children}
    </div>
  );
};
