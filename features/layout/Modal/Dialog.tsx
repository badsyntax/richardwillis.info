import React from 'react';
import classNames from 'classnames/bind';

import STYLES from './Dialog.module.css';
const classes = classNames.bind(STYLES);

export interface DialogProps {
  onClose: () => void;
}

export const Dialog: React.FunctionComponent<DialogProps> = ({
  onClose,
  children,
}) => {
  return (
    <div
      className={classes('root')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className={classes('header')}>
        <button
          type="button"
          className={classes('close-button')}
          onClick={onClose}
        >
          X
        </button>
      </div>
      <div className={classes('body')}>{children}</div>
    </div>
  );
};
