import getConfig from 'next/config';
import { Repo } from '../../types/types';

const { staticManEndpoint, staticManGitProvider, staticManRepo } = getConfig().publicRuntimeConfig;

async function makeRequest(
  url: string,
  fetchOpts: RequestInit
): Promise<Response> {
  const response = await fetch(url, fetchOpts);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

export function postComment(comment: FormData): Promise<Response> {
  const url = `${staticManEndpoint}/v3/entry/${staticManGitProvider}/${staticManRepo}/master/comments`;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const searchParams = new URLSearchParams(comment);
  return makeRequest(url, {
    body: searchParams,
    method: 'POST',
    keepalive: true,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  });
}

export async function getGithubRepos(): Promise<Repo[]> {
  const url = `/api/projects`;
  const res = await makeRequest(url, {
    headers: new Headers({
      method: 'GET',
      Accept: 'application/json',
    }),
  });
  return await res.json();
}
