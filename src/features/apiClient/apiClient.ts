import config from '../../config/config';

const { staticManEndpoint, staticManRepo } = config;

export const postComment = (comment: FormData): Promise<Response> => {
  const url = `${staticManEndpoint}/v2/entry/${staticManRepo}/master/comments`;
  const searchParams = new URLSearchParams(comment as any);
  return fetch(url, {
    body: searchParams,
    method: 'POST',
    keepalive: true,
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response;
  });
};
