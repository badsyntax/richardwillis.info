import React from 'react';
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';

import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface PostBodyProps {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
}

export const PostBody: React.FC<PostBodyProps> = ({ mdxSource }) => {
  return <MarkdownContent mdxSource={mdxSource} />;
};
