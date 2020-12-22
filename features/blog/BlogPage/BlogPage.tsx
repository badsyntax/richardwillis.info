import React from 'react';
import classNames from 'classnames/bind';
import { PageShell } from '../../layout/PageShell/PageShell';
import { Post } from '../types';
import { PostsIndex } from '../PostsIndex/PostsIndex';

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
    <PageShell title="Blog" mainClassName={classes('root')}>
      <PostsIndex posts={allPosts} />
    </PageShell>
  );
};
