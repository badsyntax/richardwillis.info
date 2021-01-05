export type ProjectTag = string;

export interface Project {
  name: string;
  repoUrl: string;
  title: string;
  description: string;
  tags: ProjectTag[];
}

export type ProjectWithGitHubStars = Project & {
  stars: number;
};
