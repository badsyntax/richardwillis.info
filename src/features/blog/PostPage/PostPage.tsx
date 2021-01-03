import React from 'react';

import { PageShell } from '../../layout/PageShell/PageShell';
import { PostBody } from '../PostBody/PostBody';
import { PostHeader } from '../PostHeader/PostHeader';
import { Post } from '../types';
import { PostComments } from '../PostComments/PostComments';

export interface PostPagePros {
  post: Post;
  morePosts: boolean;
}

export const PostPage: React.FunctionComponent<PostPagePros> = ({ post }) => {
  return (
    <PageShell title={`${post.title} - Blog`} description={post.excerpt}>
      <PostHeader title={post.title} date={post.date} author={post.author} />
      <PostBody content={post.contentHtml} />
      <PostComments comments={post.comments} slug={post.slug} />
    </PageShell>
  );
};
