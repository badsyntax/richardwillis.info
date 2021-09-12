/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Label.module.scss';
import { Typography } from '../Typography/Typography';
const classes = classNames.bind(STYLES);

export type LabelProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
> & {
  hidden?: boolean;
};

export const Label: React.FunctionComponent<LabelProps> = ({
  className,
  hidden,
  ...props
}) => {
  return (
    <div>
      <Typography
        as="label"
        className={classes('root', hidden && 'hidden', className)}
        {...props}
      />
    </div>
  );
};
