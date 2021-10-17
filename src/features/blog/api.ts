import { apiClient } from '../api/apiClient';
import { Article } from '../api/strapi';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// @ts-expect-error
import rehypePrism from '@mapbox/rehype-prism';

export type SerializedArticle = Omit<
  Article,
  | 'author'
  | 'category'
  | 'publishDate'
  | 'publishedAt'
  | 'content'
  | 'image'
  | 'excerpt'
> & {
  author: Article['author'] | null;
  category: Article['category'] | null;
  publishDate: string;
  publishedAt?: string;
};

export type SerializedArticleWithMdx = SerializedArticle & {
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

async function getSerializableArticle({
  id,
  description,
  slug,
  publishDate,
  publishedAt,
  title,
}: Article): Promise<SerializedArticle> {
  return {
    category: null,
    author: null,
    id,
    description,
    title,
    slug,
    publishDate: publishDate?.toISOString(),
    publishedAt: publishedAt?.toISOString(),
  };
}

async function getSerializableArticleWithMdx(
  article: Article
): Promise<SerializedArticleWithMdx> {
  return {
    ...(await getSerializableArticle(article)),
    mdxSource: await getMdxSource(article.content || ''),
  };
}

export async function getArticleBySlug(
  slug: string,
  fields: string[] = []
): Promise<SerializedArticleWithMdx> {
  const article = await apiClient.articleApi.articlesSlugGet({
    slug,
  });
  return getSerializableArticleWithMdx(article);
}

export async function getAllArticles(): Promise<SerializedArticle[]> {
  const articles = await apiClient.articleApi.articlesGet({
    sort: 'publish_date:DESC',
  });
  return Promise.all(articles.map(getSerializableArticle));
}
