import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import { MdClose, MdMenu } from 'react-icons/md';

import { Nav } from '../Nav/Nav';

import STYLES from './MobileNav.module.scss';
import { Fragment } from 'react';
const classes = classNames.bind(STYLES);

const OpenMenuButton: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    isVisible: boolean;
  }
> = ({ isVisible, ...props }) => {
  return (
    <button className={classes('menu-button')} aria-expanded="false" {...props}>
      <span className={classes('menu-button-label')}>Open main menu</span>
      {isVisible ? <MdClose /> : <MdMenu />}
    </button>
  );
};

const Portal: React.FC = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const Overlay: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ ...props }) => {
  return (
    <Portal>
      <div className={classes('overlay')} {...props} />
    </Portal>
  );
};

export const MobileNav: React.FC = () => {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState<boolean>(false);
  const onMenuButtonClick = () => {
    document.documentElement.classList.toggle('mobile-nav-open');
    setIsMobileNavVisible((value) => !value);
  };
  const reset = () =>
    document.documentElement.classList.remove('mobile-nav-open');
  const handleOverlayClick = () => {
    setIsMobileNavVisible(false);
    reset();
  };
  useEffect(() => {
    return reset;
  }, []);
  console.log('isMobileNavVisible', isMobileNavVisible);
  return (
    <Fragment>
      {isMobileNavVisible && <Overlay onClick={handleOverlayClick} />}
      <OpenMenuButton
        onClick={onMenuButtonClick}
        isVisible={isMobileNavVisible}
      />
      <Nav
        className={classes(
          'mobile-nav',
          isMobileNavVisible && 'mobile-nav-visible'
        )}
      />
    </Fragment>
  );
};
