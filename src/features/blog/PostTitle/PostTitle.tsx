import React from 'react';
import classNames from 'classnames/bind';
import { Typography } from '../../layout/Typography/Typography';
import STYLES from './PostTitle.module.scss';
const classes = classNames.bind(STYLES);

export const PostTitle: React.FC = ({ children }) => {
  return (
    <Typography as="h1" className={classes('root')}>
      {children}
    </Typography>
  );
};
