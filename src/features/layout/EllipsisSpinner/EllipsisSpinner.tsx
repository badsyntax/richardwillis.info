import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './EllipsisSpinner.module.css';
const classes = classNames.bind(STYLES);

export const EllipsisSpinner: React.FunctionComponent = () => {
  return (
    <div className={classes('ellipsis')}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
