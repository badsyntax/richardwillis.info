import React from 'react';
import classNames from 'classnames/bind';
import { FaGithub, FaStackOverflow, FaLinkedin } from 'react-icons/fa';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';

import STYLES from './ContactPage.module.scss';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { AboutpageSeo } from '../../api/strapi';
import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';
const classes = classNames.bind(STYLES);

export type ContactPageProps = {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  seo: AboutpageSeo;
};

export const ContactPage: React.FC<ContactPageProps> = ({ seo, mdxSource }) => {
  return (
    <PageShell title={seo.metaTitle} description={seo.metaDescription}>
      <Typography as="div" variant="prose">
        <Typography as="div" variant="prose">
          <h1>{seo.metaTitle}</h1>
          <MarkdownContent mdxSource={mdxSource} />
        </Typography>
        <ul>
          <li>
            <a
              href="https://github.com/badsyntax"
              rel="nofollow"
              className={classes('social-link')}>
              <FaGithub className={classes('icon')} /> GitHub
            </a>
          </li>
          <li>
            <a
              href="https://stackoverflow.com/users/492325/badsyntax"
              rel="nofollow"
              className={classes('social-link')}>
              <FaStackOverflow className={classes('icon')} /> StackOverflow
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/willisrh"
              rel="nofollow"
              className={classes('social-link')}>
              <FaLinkedin className={classes('icon')} /> LinkedIn
            </a>
          </li>
        </ul>
      </Typography>
    </PageShell>
  );
};
