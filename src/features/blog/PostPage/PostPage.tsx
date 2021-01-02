import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import { PageShell } from '../../layout/PageShell/PageShell';
import { PostBody } from '../PostBody/PostBody';
import { PostHeader } from '../PostHeader/PostHeader';
import { PostTitle } from '../PostTitle/PostTitle';
import { Post } from '../types';
import { PostComments } from '../PostComments/PostComments';

export interface PostPagePros {
  post: Post;
  morePosts: boolean;
}

export const PostPage: React.FunctionComponent<PostPagePros> = ({
  post,
  morePosts,
}) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <PageShell title={`${post.title} - Blog`} description={post.excerpt}>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <Fragment>
          <PostHeader
            title={post.title}
            date={post.date}
            author={post.author}
          />
          <PostBody content={post.content} />
          <PostComments comments={post.comments} slug={post.slug} />
        </Fragment>
      )}
    </PageShell>
  );
};
