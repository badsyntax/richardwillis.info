import { Post, PostComment } from './types';
import { markdownToHtml } from '../markdown/markdownToHtml';
import { apiClient } from '../api/apiClient';
import { Article } from '../api/strapi';

export function getComments(slug: string): PostComment[] {
  return [];
}

export function getBlogPost(article: Article, fields: string[] = []): Post {
  function getPostData(article: Article, key: string): Article[keyof Article] {
    switch (key) {
      case 'date':
        return article.publishedAt?.toISOString();
      case 'excerpt':
        return article.excerpt || '';
      case 'author':
        return article.author || '';
      case 'contentHtml':
        return markdownToHtml(article.content || '');
      case 'comments':
        return [];
      case 'ogImage':
        return '';
      default:
        return (article as any)[key];
    }
  }

  const blogPost = fields.reduce<Partial<Post>>(
    (acc: Partial<Post>, field: string) => ({
      ...acc,
      [field]: getPostData(article, field),
    }),
    {}
  ) as Post;

  return blogPost;
}

export async function getPostBySlug(
  slug: string,
  fields: string[] = []
): Promise<Post> {
  const article = await apiClient.articleApi.articlesSlugGet({
    slug,
  });
  return getBlogPost(article, fields);
}

export async function getAllPosts(fields: string[] = []): Promise<Post[]> {
  const articles = await apiClient.articleApi.articlesGet({});
  return articles.map((article) => getBlogPost(article, fields));
}

export function getAllVisiblePosts(fields: string[] = []): Promise<Post[]> {
  return getAllPosts(fields);
}
