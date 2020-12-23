import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { MdClose, MdMenu } from 'react-icons/md';
import { Link } from '../Link/Link';
import { Nav } from '../Nav/Nav';
import STYLES from './Header.module.css';
const classes = classNames.bind(STYLES);

const OpenMenuButton: React.FunctionComponent<
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

export const Header: React.FunctionComponent = () => {
  const [isMobileNavVisible, setIsMobileNavVisible] = useState<boolean>(false);
  const onMenuButtonClick = () => setIsMobileNavVisible((value) => !value);
  return (
    <header className={classes('root')}>
      <div className={classes('inner')}>
        <OpenMenuButton
          onClick={onMenuButtonClick}
          isVisible={isMobileNavVisible}
        />
        <div className={classes('body')}>
          <Link href="/" className={classes('title')}>
            Richard Willis
          </Link>
          <Nav className={classes('nav')} />
        </div>
      </div>
      <Nav
        className={classes(
          'mobile-nav',
          isMobileNavVisible && 'mobile-nav-visible'
        )}
      />
    </header>
  );
};
