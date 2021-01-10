import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import classNames from 'classnames/bind';

import { Overlay } from './Overlay';
import { Dialog } from './Dialog';

import STYLES from './Modal.module.css';
const classes = classNames.bind(STYLES);

export interface ModalProps {
  open: boolean;
  onClose: () => void;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  open,
  onClose,
  children,
}) => {
  useLayoutEffect(() => {
    document.body.classList[open ? 'add' : 'remove'](classes('no-scroll'));
  }, [open]);
  return open ? (
    <Fragment>
      <Overlay />
      <div className={classes('root')}>
        <Dialog children={children} onClose={onClose} />
      </div>
    </Fragment>
  ) : null;
};
