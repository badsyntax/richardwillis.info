import { apiClient } from '../api/apiClient';
import { Article, Comment } from '../api/strapi';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';
import { CommentWithMdxSource } from './types';

export type SerializedArticle = Omit<
  Article,
  | 'author'
  | 'category'
  | 'publishDate'
  | 'publishedAt'
  | 'image'
  | 'content'
  | 'comments'
> & {
  author: Article['author'] | null;
  category: Article['category'] | null;
  publishDate: string;
  publishedAt?: string;
  comments: CommentWithMdxSource[];
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
};

function getMdxSource(
  markdown: string
): Promise<MDXRemoteSerializeResult<Record<string, unknown>>> {
  return serialize(markdown, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        rehypeExternalLinks,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: 'anchor',
              ariaHidden: 'true',
              ariaLabel: 'Heading anchor',
              tabIndex: -1,
            },
            content: {
              type: 'element',
              tagName: 'span',
              properties: { className: ['icon'] },
              children: [],
            },
          },
        ],
      ],
    },
  });
}

function getSimpleMdxSource(
  markdown: string
): Promise<MDXRemoteSerializeResult<Record<string, unknown>>> {
  return serialize(markdown, {
    mdxOptions: {
      rehypePlugins: [rehypeExternalLinks, rehypePrism],
    },
  });
}

async function getSerializableArticle({
  id,
  title,
  slug,
  description,
  publishDate,
  publishedAt,
  content,
  comments = [],
}: Article): Promise<SerializedArticle> {
  const commentsWithMdxSource = await Promise.all(
    (comments as Comment[]).map((comment) =>
      getSimpleMdxSource(comment.body || '').then((mdxSource) => ({
        ...comment,
        id: comment.id,
        author: comment.author,
        publishedAt: comment.publishedAt?.toISOString(),
        createdAt: comment.createdAt?.toISOString(),
        mdxSource,
      }))
    )
  );

  return {
    id,
    title,
    slug,
    description,
    category: null,
    author: null,
    comments: commentsWithMdxSource,
    publishDate: publishDate?.toISOString(),
    publishedAt: publishedAt?.toISOString(),
    mdxSource: await getMdxSource(content || ''),
  };
}

export async function getArticleBySlug(
  slug: string,
  fields: string[] = []
): Promise<SerializedArticle> {
  const article = await getSerializableArticle(
    await apiClient.articleApi.articlesSlugGet({
      slug,
    })
  );
  return article;
}

export async function getAllArticles(): Promise<SerializedArticle[]> {
  const articles = await apiClient.articleApi.articlesGet({
    sort: 'publish_date:DESC',
  });
  return Promise.all(articles.map(getSerializableArticle));
}
