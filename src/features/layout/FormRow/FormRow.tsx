import React from 'react';
import classNames from 'classnames';
import * as styles from './FormRow.css';

export type FormRowProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const FormRow: React.FunctionComponent<FormRowProps> = ({
  className,
  ...props
}) => {
  return <div className={classNames(styles.root, className)} {...props} />;
};
