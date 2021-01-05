import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';
import type { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';
import { ConsoleChannel } from '../../features/logger/channels/ConsoleChannel';
import { Logger } from '../../features/logger/logger';
import { Repo } from '../../types/types';

type GitHubRepos = RestEndpointMethodTypes['repos']['listForOrg']['response']['data'];

const MAX_RESULTS_PER_PAGE = 100; // github will only allow 100 results per page
const GITHUB_USER = 'badsyntax';
const CACHE_KEY = 'GITHUB_REPOS';
const CACHE_TTL = 60 * 60 * 24; // 1 day

const logger = new Logger([new ConsoleChannel()], 'projects');
const octokit = new Octokit();

const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: 0,
});

async function getPaginatedRepos(
  username: string,
  page = 1,
  perPage = MAX_RESULTS_PER_PAGE
): Promise<GitHubRepos> {
  const { data } = await octokit.repos.listForUser({
    username,
    per_page: perPage,
    page,
  });
  return data;
}

async function getAllRepos(username: string): Promise<GitHubRepos> {
  let allRepos: GitHubRepos = [];
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const repos = await getPaginatedRepos(username, page);
      allRepos = ([] as GitHubRepos).concat(allRepos, repos);
      if (repos.length === MAX_RESULTS_PER_PAGE) {
        page++;
      } else {
        break;
      }
    } catch (e) {
      logger.error('Error getting repos from GitHub', e.message);
      break;
    }
  }
  return allRepos;
}

async function getAndCacheRepos(): Promise<Repo[]> {
  let repos = cache.get<Repo[]>(CACHE_KEY);
  if (repos === undefined) {
    const allRepos = await getAllRepos(GITHUB_USER);
    repos = allRepos
      .filter((repoResponse) => !repoResponse.fork)
      .map((repoResponse) => ({
        name: repoResponse.name,
        stars: Number(repoResponse.stargazers_count),
      }));
    cache.set(CACHE_KEY, repos);
    logger.info('Cache set for', CACHE_KEY);
  }
  return repos;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Repo[]>
): Promise<void> => {
  const { method } = req;
  switch (method) {
    case 'GET': {
      const repos = await getAndCacheRepos();
      res.status(200).json(repos);
      break;
    }
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};
