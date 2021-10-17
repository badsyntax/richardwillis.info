import { apiClient } from '../api/apiClient';
import { Project, Projectspage } from '../api/strapi';

export async function getAllProjects(): Promise<Project[]> {
  const projects = await apiClient.projectApi.projectsGet({
    sort: 'datePublished:DESC',
  });
  return projects.map((project) =>
    Object.assign(project, {
      publishedAt: project.publishedAt?.toISOString(),
      datePublished: project.datePublished?.toISOString(),
    })
  );
}

export async function getProjectsPage(): Promise<Projectspage> {
  return await apiClient.projectspageApi.projectspageGet({});
}
