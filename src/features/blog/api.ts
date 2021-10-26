import { apiClient } from '../api/apiClient';
import { Article } from '../api/strapi';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { getMdxSource } from '../mdx/util';

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
