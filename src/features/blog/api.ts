import { apiClient } from '../api/apiClient';
import { Article } from '../api/strapi';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';

export type SerializedArticle = Omit<
  Article,
  'author' | 'category' | 'publishDate' | 'publishedAt'
> & {
  author: Article['author'] | null;
  category: Article['category'] | null;
  publishDate: string;
  publishedAt?: string;
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

async function getSerializableArticle(
  article: Article
): Promise<SerializedArticle> {
  return {
    ...article,
    category: null,
    author: null,
    publishDate: article.publishDate?.toISOString(),
    publishedAt: article.publishedAt?.toISOString(),
    mdxSource: await getMdxSource(article.content || ''),
  };
}

export async function getArticleBySlug(
  slug: string,
  fields: string[] = []
): Promise<SerializedArticle> {
  const article = await apiClient.articleApi.articlesSlugGet({
    slug,
  });
  return getSerializableArticle(article);
}

export async function getAllArticles(): Promise<SerializedArticle[]> {
  const articles = await apiClient.articleApi.articlesGet({
    sort: 'publish_date:DESC',
  });
  return Promise.all(articles.map(getSerializableArticle));
}
