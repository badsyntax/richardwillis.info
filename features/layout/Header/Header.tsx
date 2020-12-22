import React from 'react';
import classNames from 'classnames/bind';
import { Link } from '../Link/Link';
import { Nav } from '../Nav/Nav';
import STYLES from './Header.module.css';
const classes = classNames.bind(STYLES);

export const Header: React.FunctionComponent = () => {
  return (
    <header className={classes('root')}>
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        <button className={classes('open-menu-button')} aria-expanded="false">
          <span className="sr-only">Open main menu</span>
          <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            className="hidden h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className={classes('nav-container')}>
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className={classes('title')}>
            Richard Willis
          </Link>
        </div>
        <div className="hidden sm:block sm:ml-6">
          <Nav />
        </div>
      </div>
    </header>
  );
};
