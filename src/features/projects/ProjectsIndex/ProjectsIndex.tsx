import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { FaGithub } from 'react-icons/fa';
import { Project } from '../types';
import { Card } from '../../layout/Card/Card';

import STYLES from './ProjectsIndex.module.css';
const classes = classNames.bind(STYLES);

export interface ProjectsIndexProps {
  projects: Project[];
}

export const ProjectsIndex: React.FunctionComponent<ProjectsIndexProps> = ({
  projects,
}) => {
  return (
    <nav className={classes('root')}>
      {projects.map((project, i) => {
        return (
          <Card href={project.repoUrl} className={classes('card')} key={i}>
            <Card.Title className={classes('title')}>
              <FaGithub className={classes('icon')} />
              {project.title}
            </Card.Title>
            <Card.Content>{project.description}</Card.Content>
            <Card.Content className={classes('tags')}>
              {project.tags.map((tag, i) => (
                <span key={tag}>
                  {tag}
                  {i < project.tags.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Card.Content>
          </Card>
        );
      })}
    </nav>
  );
};
