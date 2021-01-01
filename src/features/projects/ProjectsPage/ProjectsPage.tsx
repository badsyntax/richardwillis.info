import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';

import { Typography } from '../../layout/Typography/Typography';
import { ProjectsIndex } from '../ProjectsIndex/ProjectsIndex';
import { projects } from './projects';

import STYLES from './ProjectsPage.module.css';
const classes = classNames.bind(STYLES);

export const ProjectsPage: React.FunctionComponent = () => {
  return (
    <PageShell
      title="Projects"
      description="Open-source projects by Richard Willis"
    >
      <Typography as="div" variant="prose" className={classes('content')}>
        <h1>Projects</h1>
        <p>
          I've always enjoyed programming as a hobby in my free time. I mostly
          dabble with web related tech and enjoy working with TypeScript &amp;
          Node.js but I'm also somewhat proficient with Python and Java.
        </p>
        <p>
          Most of my personal projects are typically incomplete but I've somehow
          been able to create a couple semi-popular projects. I try to release
          all my code as Open Source.
        </p>
      </Typography>
      <ProjectsIndex projects={projects} />
    </PageShell>
  );
};
