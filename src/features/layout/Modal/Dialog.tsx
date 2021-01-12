/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames/bind';
import { CgClose } from 'react-icons/cg';

import STYLES from './Dialog.module.css';
import { DialogButton } from './DialogButton';
const classes = classNames.bind(STYLES);

export interface DialogProps {
  onClose: () => void;
}

export const Dialog: React.FunctionComponent<DialogProps> = ({
  onClose,
  children,
}) => {
  const onContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  return (
    <div
      className={classes('root')}
      role="dialog"
      aria-modal="true"
      onClick={onContainerClick}
    >
      <DialogButton className={classes('close-button')} onClick={onClose}>
        <CgClose />
      </DialogButton>
      {children}
    </div>
  );
};
