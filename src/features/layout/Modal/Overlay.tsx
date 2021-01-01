import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Overlay.module.css';
const classes = classNames.bind(STYLES);

export const Overlay: React.FunctionComponent = () => {
  return <div className={classes('root')} aria-hidden="true" />;
};
