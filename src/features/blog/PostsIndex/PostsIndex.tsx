import React from 'react';

import { BlogPostCard } from '../BlogPostCard/BlogPostCard';
import { SerializedArticle } from '../api';
import * as styles from './PostsIndex.css';

export interface PostsIndexProps {
  articles: SerializedArticle[];
}

export const PostsIndex: React.FC<PostsIndexProps> = ({ articles }) => {
  return (
    <nav className={styles.root}>
      {articles.map((article) => {
        return (
          <BlogPostCard
            title={article.title}
            excerpt={article.description}
            date={article.publishDate}
            href={`/blog/${article.slug}`}
            key={article.slug}
          />
        );
      })}
    </nav>
  );
};
