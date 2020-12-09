import React from 'react';
import { PageShell } from '../../layout/PageShell/PageShell';
import { Post } from '../types';
import { Intro } from '../Intro/Intro';
import { HeroPost } from '../HeroPost/HeroPost';
import { MoreStories } from '../MoreStories/MoreStories';

export interface BlogPageProps {
  allPosts: Post[];
}

export const BlogPage: React.FunctionComponent<BlogPageProps> = ({
  allPosts,
}) => {
  if (!allPosts) {
    return null;
  }
  const heroPost = allPosts[0];
  const morePosts = allPosts.slice(1);

  console.log('heropost', heroPost);
  return (
    <PageShell title="Blog">
      <Intro />
      {heroPost && (
        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          author={heroPost.author}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />
      )}
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </PageShell>
  );
};
