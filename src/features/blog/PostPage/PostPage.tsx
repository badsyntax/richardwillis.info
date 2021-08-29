import React from 'react';
import classNames from 'classnames/bind';

import { PageShell } from '../../layout/PageShell/PageShell';
import { Typography } from '../../layout/Typography/Typography';
import { PostBody } from '../PostBody/PostBody';
import { PostHeader } from '../PostHeader/PostHeader';
import { Post } from '../types';

import STYLES from './PostPage.module.scss';
const classes = classNames.bind(STYLES);

export interface PostPagePros {
  post: Post;
  morePosts: boolean;
}

export const PostPage: React.FC<PostPagePros> = ({ post }) => {
  return (
    <PageShell title={`${post.title} - Blog`} description={post.excerpt}>
      <PostHeader title={post.title} date={post.date} author={post.author} />
      <Typography as="hr" className={classes('hr')} />
      {post.contentHtml && <PostBody content={post.contentHtml} />}
      {/* <PostComments comments={post.comments} slug={post.slug} /> */}
    </PageShell>
  );
};
