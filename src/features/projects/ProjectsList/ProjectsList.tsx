import React, { Fragment } from 'react';
import { Card } from '../../layout/Card/Card';
import { Project } from '../../api/strapi';
import * as styles from './ProjectsList.css';

export type ProjectsListProps = {
  projects: Project[];
};

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
  // const projectsWithStars = useEnrichProjectsWithStars(projects);
  return (
    <nav className={styles.root}>
      {projects.map((project, i) => {
        const tags = (project.tags || '').split(', ');
        return (
          <Card href={project.repoUrl || '#'} className={styles.card} key={i}>
            <Card.Title className={styles.title}>
              {/* <FaGithub className={classes('github-icon')} /> */}
              {project.title}
            </Card.Title>
            <Card.Content>{project.description}</Card.Content>
            <div className={styles.footer}>
              <Card.Content className={styles.tags}>
                {tags.map((tag, i) => (
                  <span key={tag}>
                    {tag}
                    {i < tags.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </Card.Content>
              <div className={styles.stars}>
                {/* {project.stars !== undefined && (
                  <Fragment>
                    <FaRegStar className={classes('star-icon')} />
                    <span className={classes('star-text')}>
                      {project.stars}
                    </span>
                  </Fragment>
                )} */}
              </div>
            </div>
          </Card>
        );
      })}
    </nav>
  );
};
