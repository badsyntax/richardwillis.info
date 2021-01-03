export type ProjectTag = string;

export interface Project {
  repoUrl: string;
  title: string;
  description: string;
  tags: ProjectTag[];
}
