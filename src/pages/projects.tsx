import { GetStaticProps } from 'next';
import { getSanitisedResponse } from '../features/api/apiClient';
import { AboutpageSeo } from '../features/api/strapi';
import { getMdxSource } from '../features/mdx/util';

export { ProjectsPage as default } from '../features/projects/ProjectsPage/ProjectsPage';

import { getAllProjects, getProjectsPage } from '../features/projects/api';
import { ProjectsPageProps } from '../features/projects/ProjectsPage/ProjectsPage';

export const getStaticProps: GetStaticProps<ProjectsPageProps> = async () => {
  const allProjects = await getAllProjects();
  const projectsPage = await getProjectsPage();
  const { body = '', seo } = projectsPage;
  const mdxSource = await getMdxSource(body);
  return {
    props: {
      allProjects,
      mdxSource,
      seo: getSanitisedResponse<AboutpageSeo>(seo),
    },
  };
};
