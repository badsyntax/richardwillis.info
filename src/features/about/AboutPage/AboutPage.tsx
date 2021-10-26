import React from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';

import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';
import { AboutpageSeo } from '../../api/strapi';

export type AboutPageProps = {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  seo: AboutpageSeo;
};

export const AboutPage: React.FC<AboutPageProps> = ({ mdxSource, seo }) => {
  return (
    <PageShell title={seo.metaTitle} description={seo.metaDescription}>
      <Typography as="div" variant="prose" addChildClasses>
        <h1>{seo.metaTitle}</h1>
        <MarkdownContent mdxSource={mdxSource} />
      </Typography>
    </PageShell>
  );
};
