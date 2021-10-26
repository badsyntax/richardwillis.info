import React from 'react';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';
import { PostBody } from '../PostBody/PostBody';
import { PostHeader } from '../PostHeader/PostHeader';

import { SerializedArticleWithMdx } from '../api';
import { PostComments } from '../PostComments/PostComments';

export interface PostPageProps {
  article?: SerializedArticleWithMdx;
}

export const PostPage: React.FC<PostPageProps> = ({ article }) => {
  if (!article) {
    return null;
  }
  return (
    <PageShell
      title={`${article.title} - Blog`}
      description={article.description}>
      <PostHeader
        title={article.title}
        date={article.publishDate}
        // author={article.author}
      />
      <Typography as="hr" />
      {article.mdxSource && <PostBody mdxSource={article.mdxSource} />}
      {/* <PostComments comments={post.comments} slug={post.slug} /> */}
      <PostComments comments={[]} articleId={article.id} />
    </PageShell>
  );
};
