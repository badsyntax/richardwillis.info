/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
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

const layoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const Modal: React.FunctionComponent<ModalProps> = ({
  open,
  onClose,
  children,
}) => {
  layoutEffect(() => {
    document.body.classList[open ? 'add' : 'remove'](classes('no-scroll'));
  }, [open]);
  return open ? (
    <Fragment>
      <Overlay />
      <div className={classes('root')} onClick={onClose}>
        <Dialog children={children} onClose={onClose} />
      </div>
    </Fragment>
  ) : null;
};
