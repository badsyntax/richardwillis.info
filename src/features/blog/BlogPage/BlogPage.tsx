import React from 'react';
import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';
import { SerializedArticle } from '../api';
import { PostsIndex } from '../PostsIndex/PostsIndex';
export interface BlogPageProps {
  allArticles: SerializedArticle[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ allArticles }) => {
  return (
    <PageShell title="Blog" description="Blog posts by Richard Willis">
      <Typography as="div" variant="prose">
        <h1>Blog</h1>
      </Typography>
      <PostsIndex articles={allArticles} />
    </PageShell>
  );
};
