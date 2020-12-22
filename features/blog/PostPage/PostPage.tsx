import React from 'react';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';
import { PostBody } from '../PostBody/PostBody';
import { PostHeader } from '../PostHeader/PostHeader';
import { PostTitle } from '../PostTitle/PostTitle';
import { Post } from '../types';
import STYLES from './PostPage.module.css';
const classes = classNames.bind(STYLES);

export interface PostPagePros {
  post: Post;
  morePosts: boolean;
  preview: boolean;
}

export const PostPage: React.FunctionComponent<PostPagePros> = ({
  post,
  morePosts,
  preview,
}) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <PageShell preview={preview} title={`Blog - ${post.title}`}>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <article className={classes('root')}>
          <PostHeader
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
          />
          <PostBody content={post.content} />
        </article>
      )}
    </PageShell>
  );
};
