import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Post } from '../types';
import { PostsIndex } from '../PostsIndex/PostsIndex';
import { Typography } from '../../layout/Typography/Typography';

import STYLES from './BlogPage.module.css';
const classes = classNames.bind(STYLES);

export interface BlogPageProps {
  allPosts: Post[];
}

export const BlogPage: React.FunctionComponent<BlogPageProps> = ({
  allPosts,
}) => {
  if (!allPosts) {
    return null;
  }
  return (
    <PageShell title="Blog" description="Blog posts by Richard Wilis">
      <Typography as="div" variant="prose">
        <h1>Blog</h1>
        <p>General ramblings about code and stuff...</p>
      </Typography>
      <PostsIndex posts={allPosts} />
    </PageShell>
  );
};
