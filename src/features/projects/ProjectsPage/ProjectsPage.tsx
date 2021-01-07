import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';

import { Typography } from '../../layout/Typography/Typography';
import { ProjectsList } from '../ProjectsList/ProjectsList';
import { projects } from './projects';

import STYLES from './ProjectsPage.module.css';
import { Link } from '../../layout/Link/Link';
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
          I enjoy working with web related tech like TypeScript, Node.js, Python
          &amp; Java. I try to contribute to Open Source where I can, and mostly
          all of my personal code is released as OSS.
        </p>
        <p>
          Below are a few of the projects I've been working on. You can find all
          my projects <Link href="https://github.com/badsyntax">on GitHub</Link>
          .
        </p>
      </Typography>
      <ProjectsList projects={projects} />
      {/* <Typography as="h2">GitHub Stats</Typography> */}
      {/* <p>Some of my GitHub stats here</p> */}
    </PageShell>
  );
};
