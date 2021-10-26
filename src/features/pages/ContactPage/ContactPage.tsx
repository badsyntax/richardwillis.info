import React from 'react';
import { FaGithub, FaStackOverflow, FaLinkedin } from 'react-icons/fa';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';

import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { AboutpageSeo } from '../../api/strapi';
import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';

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
            <a href="https://github.com/badsyntax" rel="nofollow">
              <FaGithub /> GitHub
            </a>
          </li>
          <li>
            <a
              href="https://stackoverflow.com/users/492325/badsyntax"
              rel="nofollow">
              <FaStackOverflow /> StackOverflow
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/willisrh" rel="nofollow">
              <FaLinkedin /> LinkedIn
            </a>
          </li>
        </ul>
      </Typography>
    </PageShell>
  );
};
