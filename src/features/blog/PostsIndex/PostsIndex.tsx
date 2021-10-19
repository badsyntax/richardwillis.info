import React from 'react';
import classNames from 'classnames/bind';
import { BlogPostCard } from '../BlogPostCard/BlogPostCard';

import STYLES from './PostsIndex.module.scss';
import { SerializedArticle } from '../api';
const classes = classNames.bind(STYLES);

export type PostsIndexProps = {
  articles: SerializedArticle[];
  className?: string;
};

export const PostsIndex: React.FC<PostsIndexProps> = ({
  className,
  articles,
  ...props
}) => {
  return (
    <nav className={classes('root', className)} {...props}>
      {articles.map((article) => {
        return (
          <BlogPostCard
            title={article.title}
            excerpt={article.description}
            date={article.publishDate}
            href={`/blog/${article.slug}`}
            key={article.slug}
            className={classes('post')}></BlogPostCard>
        );
      })}
    </nav>
  );
};
