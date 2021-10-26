/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import classNames from 'classnames';
import { Typography } from '../Typography/Typography';
import { screenReaderOnly } from '../../../styles/util.css';
import * as styles from './Label.css';

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
        className={classNames(
          styles.root,
          hidden && screenReaderOnly,
          className
        )}
        {...props}
      />
    </div>
  );
};
