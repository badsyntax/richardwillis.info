import React from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { PageShell } from '../../layout/PageShell/PageShell';
import { ProjectsList } from '../ProjectsList/ProjectsList';
import { AboutpageSeo, Project } from '../../api/strapi';
import { MarkdownContent } from '../../blog/MarkdownContent/MarkdownContent';

export interface ProjectsPageProps {
  allProjects: Project[];
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  seo: AboutpageSeo;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  allProjects,
  mdxSource,
  seo,
}) => {
  return (
    <PageShell title={seo.metaTitle} description={seo.metaDescription}>
      <h1>{seo.metaTitle}</h1>
      <MarkdownContent mdxSource={mdxSource} />
      <ProjectsList projects={allProjects} />
    </PageShell>
  );
};
