import React from 'react';
import classNames from 'classnames/bind';
import STYLES from './ProjectsIndex.module.css';
import { Project } from '../types';
import { Card } from '../../layout/Card/Card';
import { Typography } from '../../layout/Typography/Typography';
const classes = classNames.bind(STYLES);

export interface ProjectsIndexProps {
  projects: Project[];
}

export const ProjectsIndex: React.FunctionComponent<ProjectsIndexProps> = ({
  projects,
}) => {
  return (
    <nav className={classes('root')}>
      {projects.map((project) => {
        return (
          <Card href={project.repoUrl} className={classes('card')}>
            <Typography as="h3">{project.title}&nbsp;&rarr;</Typography>
            <Typography as="p">{project.description}</Typography>
            <Typography as="p" className={classes('tags')}>
              {project.tags.map((tag, i) => (
                <span>
                  {tag}
                  {i < project.tags.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Typography>
          </Card>
        );
      })}
    </nav>
  );
};
