import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';

import { FaGithub, FaStackOverflow, FaLinkedin } from 'react-icons/fa';

import STYLES from './ContactPage.module.css';
const classes = classNames.bind(STYLES);

export const ContactPage: React.FunctionComponent = () => {
  return (
    <PageShell title="Contact">
      <Typography as="div" variant="prose">
        <h1>Contact</h1>
        <ul>
          <li>
            <a
              href="https://github.com/badsyntax"
              rel="nofollow"
              className={classes('social-link')}
            >
              <FaGithub /> GitHub
            </a>
          </li>
          <li>
            <a
              href="https://stackoverflow.com/users/492325/badsyntax"
              rel="nofollow"
              className={classes('social-link')}
            >
              <FaStackOverflow /> StackOverflow
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/willisrh"
              rel="nofollow"
              className={classes('social-link')}
            >
              <FaLinkedin /> LinkedIn
            </a>
          </li>
        </ul>
      </Typography>
    </PageShell>
  );
};
