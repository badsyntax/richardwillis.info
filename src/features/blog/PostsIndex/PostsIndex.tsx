import React from 'react';
import classNames from 'classnames/bind';
import { Post } from '../types';
import { BlogPostCard } from '../BlogPostCard/BlogPostCard';

import STYLES from './PostsIndex.module.scss';
const classes = classNames.bind(STYLES);

export interface PostsIndexProps {
  posts: Post[];
}

export const PostsIndex: React.FC<PostsIndexProps> = ({ posts }) => {
  // console.log('POSTS', JSON.stringify(posts, null, 2));
  return (
    <nav className={classes('root')}>
      {posts.map((post) => {
        return (
          <BlogPostCard
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            href={`/blog/${post.slug}`}
            key={post.slug}
            className={classes('post')}
          ></BlogPostCard>
        );
      })}
    </nav>
  );
};
