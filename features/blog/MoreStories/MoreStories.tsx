import React from 'react';
import { PostPreview } from '../PostPreview/PostPreview';
import { Post } from '../types';

export interface MoreStoriesProps {
  posts: Post[];
}

export const MoreStories: React.FunctionComponent<MoreStoriesProps> = ({
  posts,
}) => {
  return (
    <section>
      <h2>More Stories</h2>
      <div>
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  );
};
