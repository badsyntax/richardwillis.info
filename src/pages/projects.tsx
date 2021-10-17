import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { getSanitisedResponse } from '../features/api/apiClient';
import { Aboutpage, AboutpageSeo } from '../features/api/strapi';

export { ProjectsPage as default } from '../features/projects/ProjectsPage/ProjectsPage';

import { getAllProjects, getProjectsPage } from '../features/projects/api';

export const getStaticProps: GetStaticProps = async () => {
  const allProjects = await getAllProjects();
  const projectsPage = await getProjectsPage();
  const { body = '', seo } = projectsPage;
  const mdxSource = await serialize(body);
  return {
    props: {
      allProjects,
      mdxSource,
      seo: getSanitisedResponse<AboutpageSeo>(seo),
    },
  };
};
