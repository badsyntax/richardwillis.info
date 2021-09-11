import React from 'react';
import classNames from 'classnames/bind';
import { BlogPostCard } from '../BlogPostCard/BlogPostCard';

import STYLES from './PostsIndex.module.scss';
import { Article } from '../../api/strapi';
import { SerializedArticle } from '../api';
const classes = classNames.bind(STYLES);

export interface PostsIndexProps {
  articles: SerializedArticle[];
}

export const PostsIndex: React.FC<PostsIndexProps> = ({ articles }) => {
  return (
    <nav className={classes('root')}>
      {articles.map((article) => {
        return (
          <BlogPostCard
            title={article.title}
            excerpt={article.excerpt}
            date={article.publishDate}
            href={`/blog/${article.slug}`}
            key={article.slug}
            className={classes('post')}
          ></BlogPostCard>
        );
      })}
    </nav>
  );
};
