import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Overlay.module.css';
const classes = classNames.bind(STYLES);

export type OverlayProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Overlay: React.FunctionComponent<OverlayProps> = ({
  className,
  ...props
}) => {
  return <div className={classes('root', className)} {...props} />;
};
