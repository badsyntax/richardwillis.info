import React from 'react';
import classNames from 'classnames/bind';
import { FaExclamationTriangle, FaCheck } from 'react-icons/fa';

import STYLES from './Flex.module.scss';
import { Typography } from '../Typography/Typography';
import { Box } from '../Box/Box';
const classes = classNames.bind(STYLES);

export type FlexProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  direction?: 'row' | 'column';
};

export const Flex: React.FC<FlexProps> = ({
  className,
  children,
  direction = 'row',
  ...props
}) => {
  return (
    <Box className={classes('root', `direction-${direction}`)} {...props}>
      {children}
    </Box>
  );
};
