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
  return (
    <div className={classes('root')} role="dialog" aria-modal="true">
      <DialogButton className={classes('close-button')} onClick={onClose}>
        <CgClose />
      </DialogButton>
      <div className={classes('body')}>{children}</div>
    </div>
  );
};
