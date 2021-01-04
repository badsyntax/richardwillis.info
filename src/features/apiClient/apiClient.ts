import getConfig from 'next/config';

const { staticManEndpoint, staticManRepo } = getConfig().publicRuntimeConfig;

export const postComment = (comment: FormData): Promise<Response> => {
  const url = `${staticManEndpoint}/v2/entry/${staticManRepo}/master/comments`;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const searchParams = new URLSearchParams(comment);
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
