import { Project } from '../types';

export const projects: Project[] = [
  {
    name: 'vscode-gradle',
    repoUrl: 'https://github.com/badsyntax/vscode-gradle',
    title: 'Gradle Tasks',
    description: 'A VS Code extension to list and run Gradle tasks.',
    tags: ['Java', 'TypeScript', 'gRPC', 'Node.js'],
  },
  {
    name: 'vscode-spotless-gradle',
    repoUrl: 'https://github.com/badsyntax/vscode-spotless-gradle',
    title: 'Spotless Gradle',
    description:
      'A VS Code extension to format your code using Spotless (via Gradle).',
    tags: ['TypeScript', 'Node.js'],
  },
  {
    name: 'grpc-js-types',
    repoUrl: 'https://github.com/badsyntax/grpc-js-types',
    title: 'gRPC TypeScript',
    description: 'Shows how to use gRPC with TypeScript.',
    tags: ['TypeScript', 'gRPC', 'Node.js'],
  },
  {
    name: 'dokku-discourse',
    repoUrl: 'https://github.com/badsyntax/dokku-discourse',
    title: 'Dokku Discourse',
    description: 'A dokku plugin to manage discourse apps.',
    tags: ['Bash'],
  },
  {
    name: 'mailinabox-ui',
    repoUrl: 'https://github.com/badsyntax/mailinabox-ui',
    title: 'Mail-in-a-Box User Interface',
    description:
      'Mail-in-a-Box User Interface built with React, Redux, TypeScript & Fluent UI.',
    tags: ['TypeScript', 'React', 'Redux'],
  },
  {
    name: 'mailinabox-api',
    repoUrl: 'https://github.com/badsyntax/mailinabox-api',
    title: 'Mail-in-a-box API',
    description: "HTTP client SDK's for the Mail-in-a-Box API.",
    tags: ['OpenAPI'],
  },
  {
    name: 'gr-20',
    repoUrl: 'https://github.com/badsyntax/gr-20',
    title: 'GR-20',
    description:
      'Some useful info on the GR-20 hike in Corsica including an interactive route viewer.',
    tags: ['TypeScript', 'React'],
  },
];
