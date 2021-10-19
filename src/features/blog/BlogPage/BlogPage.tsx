import classNames from 'classnames/bind';
import React from 'react';
import { Card } from '../../layout/Card/Card';
import { Flex } from '../../layout/Flex/Flex';
import { PageShell } from '../../layout/PageShell/PageShell';
import { Panel } from '../../layout/Panel/Panel';
import { Typography } from '../../layout/Typography/Typography';
import { SerializedArticle } from '../api';
import { PostsIndex } from '../PostsIndex/PostsIndex';

import STYLES from './BlogPage.module.scss';
const classes = classNames.bind(STYLES);

export interface BlogPageProps {
  allArticles: SerializedArticle[];
}

export const BlogPage: React.FC<BlogPageProps> = ({ allArticles }) => {
  return (
    <PageShell title="Blog" description="Blog posts by Richard Willis">
      <Typography as="div" variant="prose">
        <h1>Blog</h1>
      </Typography>
      <Flex>
        <PostsIndex articles={allArticles} className={classes('posts-index')} />
        <aside className={classes('sidebar')}>
          <Panel>
            <Card.Title>Tags</Card.Title>
            <Card.Content>Posted on</Card.Content>
          </Panel>
        </aside>
      </Flex>
    </PageShell>
  );
};
