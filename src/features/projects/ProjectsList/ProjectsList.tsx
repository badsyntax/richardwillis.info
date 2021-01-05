import React, { Fragment } from 'react';
import classNames from 'classnames/bind';
import { FaGithub, FaRegStar } from 'react-icons/fa';
import { Project } from '../types';
import { Card } from '../../layout/Card/Card';

import STYLES from './ProjectsList.module.css';
import { useEnrichProjectsWithStars } from '../../../hooks/useEnrichProjectsWithStars';
const classes = classNames.bind(STYLES);

export interface ProjectsListProps {
  projects: Project[];
}

export const ProjectsList: React.FunctionComponent<ProjectsListProps> = ({
  projects,
}) => {
  const projectsWithStars = useEnrichProjectsWithStars(projects);
  return (
    <nav className={classes('root')}>
      {projectsWithStars.map((project, i) => {
        return (
          <Card href={project.repoUrl} className={classes('card')} key={i}>
            <Card.Title className={classes('title')}>
              <FaGithub className={classes('github-icon')} />
              {project.title}
            </Card.Title>
            <Card.Content>{project.description}</Card.Content>
            <div className={classes('footer')}>
              <Card.Content className={classes('tags')}>
                {project.tags.map((tag, i) => (
                  <span key={tag}>
                    {tag}
                    {i < project.tags.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Card.Content>
              <div className={classes('stars')}>
                {project.stars !== undefined && (
                  <Fragment>
                    <FaRegStar className={classes('star-icon')} />
                    <span className={classes('star-text')}>
                      {project.stars}
                    </span>
                  </Fragment>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </nav>
  );
};
