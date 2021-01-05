import { useEffect, useState } from 'react';
import { getGithubRepos } from '../features/apiClient/apiClient';
import { Project, ProjectWithGitHubStars } from '../features/projects/types';
import { Repo } from '../types/types';

type ReposMap = Record<string, Repo>;

export const useEnrichProjectsWithStars = (
  projects: Project[]
): ProjectWithGitHubStars[] => {
  const [repos, setRepos] = useState<ReposMap>({});

  useEffect(() => {
    getGithubRepos().then((repos) => {
      const map: ReposMap = {};
      repos.forEach((repo) => {
        map[repo.name] = repo;
      });
      setRepos(map);
    });
  }, []);

  return projects.map<ProjectWithGitHubStars>((project) => ({
    ...project,
    stars: repos[project.name]?.stars,
  }));
};
