import React, { Fragment, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { MdClose, MdMenu } from 'react-icons/md';

import { Nav } from '../Nav/Nav';

import * as styles from './MobileNav.css';

const OpenMenuButton: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    isVisible: boolean;
  }
> = ({ isVisible, ...props }) => {
  return (
    <button className={styles.menuButton} aria-expanded="false" {...props}>
      <span className={styles.menuButtonLabel}>Open main menu</span>
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
      <div className={styles.overlay} {...props} />
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
  return (
    <Fragment>
      {isMobileNavVisible && <Overlay onClick={handleOverlayClick} />}
      <OpenMenuButton
        onClick={onMenuButtonClick}
        isVisible={isMobileNavVisible}
      />
      <Nav
        className={classNames(
          styles.mobileNav,
          isMobileNavVisible && styles.mobileNavVisible
        )}
      />
    </Fragment>
  );
};
