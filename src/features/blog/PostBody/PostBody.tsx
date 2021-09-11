import React from 'react';
import classNames from 'classnames/bind';
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';

import STYLES from './PostBody.module.scss';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
const classes = classNames.bind(STYLES);

export interface PostBodyProps {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export const PostBody: React.FC<PostBodyProps> = ({ mdxSource }) => {
  return <MarkdownContent mdxSource={mdxSource} className={classes('root')} />;
};
