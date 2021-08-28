import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';
import { Link } from '../../layout/Link/Link';
import { ProjectsList } from '../ProjectsList/ProjectsList';
import { Project } from '../../api/strapi';

import STYLES from './ProjectsPage.module.scss';
const classes = classNames.bind(STYLES);

export interface ProjectsPageProps {
  allProjects: Project[];
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ allProjects }) => {
  return (
    <PageShell
      title="Projects"
      description="Open-source projects by Richard Willis"
    >
      <Typography as="div" variant="prose" className={classes('content')}>
        <h1>Projects</h1>
        <p>
          I enjoy working with web related tech like TypeScript, Node.js, Python
          &amp; Java. I try to contribute to Open Source where I can, and mostly
          all of my personal code is released as OSS.
        </p>
        <p>
          Below are a few of the projects I&apos;ve been working on. You can
          find all my projects{' '}
          <Link href="https://github.com/badsyntax">on GitHub</Link>.
        </p>
      </Typography>
      <ProjectsList projects={allProjects} />
    </PageShell>
  );
};
