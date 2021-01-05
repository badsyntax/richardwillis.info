import { Octokit, RestEndpointMethodTypes } from '@octokit/rest';

const octokit = new Octokit();

export function getRepos(
  username: string
): Promise<RestEndpointMethodTypes['repos']['listForOrg']['response']['data']> {
  // NEED TO DO THIS IN SERVER /API
  return octokit.repos
    .listForUser({
      username,
      per_page: 500,
    })
    .then(({ data }) => {
      return data;
    });
}
