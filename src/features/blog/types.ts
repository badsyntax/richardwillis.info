import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Comment } from '../api/strapi';

export type CommentWithMdxSource = Omit<
  Comment,
  'publishedAt' | 'createdAt'
> & {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
  publishedAt?: string;
  createdAt?: string;
};
