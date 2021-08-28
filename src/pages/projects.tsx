import { GetStaticProps } from 'next';

export { ProjectsPage as default } from '../features/projects/ProjectsPage/ProjectsPage';

import { getAllProjects } from '../features/projects/api';

export const getStaticProps: GetStaticProps = async () => {
  const allProjects = await getAllProjects();
  return {
    props: { allProjects },
  };
};
