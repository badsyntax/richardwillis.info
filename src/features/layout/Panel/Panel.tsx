import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Panel.module.scss';
const classes = classNames.bind(STYLES);

type PanelProps = {
  className?: string;
};

export const Panel: React.FC<PanelProps> = ({ className, ...props }) => {
  return <div className={classes('root', className)} {...props}></div>;
};
