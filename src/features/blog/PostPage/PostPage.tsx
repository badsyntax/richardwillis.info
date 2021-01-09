import React, { useState } from 'react';

import { PageShell } from '../../layout/PageShell/PageShell';
import { PostBody } from '../PostBody/PostBody';
import { PostHeader } from '../PostHeader/PostHeader';
import { Post } from '../types';
import { PostComments } from '../PostComments/PostComments';
import { PostBodyEditor } from '../PostBodyEditor/PostBodyEditor';

export interface PostPagePros {
  post: Post;
  morePosts: boolean;
}

export const PostPage: React.FunctionComponent<PostPagePros> = ({ post }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [markdown, setMarkdown] = useState<string>();
  return (
    <PageShell title={`${post.title} - Blog`} description={post.excerpt}>
      <PostHeader
        title={post.title}
        date={post.date}
        author={post.author}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      {isEditing ? (
        <PostBodyEditor
          slug={post.slug}
          markdown={markdown}
          setMarkdown={setMarkdown}
        />
      ) : (
        <PostBody content={post.contentHtml} />
      )}
      <PostComments comments={post.comments} slug={post.slug} />
    </PageShell>
  );
};
