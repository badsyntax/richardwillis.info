import fs from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';
import matter from 'gray-matter';
import { Post, PostComment } from './types';
import { logger } from '../logger/logger';
import { markdownToSimpleHtml } from '../markdown/markdownToSimpleHtml';
import { markdownToHtml } from '../markdown/markdownToHtml';

const postsDirectory = join(process.cwd(), 'blog');
const commentsDirectory = join(postsDirectory, 'comments');

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter(
      (file: string) => !fs.lstatSync(join(postsDirectory, file)).isDirectory()
    );
}

export function getComments(slug: string): PostComment[] {
  const rootDir = join(commentsDirectory, slug);
  if (!fs.existsSync(rootDir)) {
    return [];
  }

  function notNull<T>(value: T | null): value is T {
    return value !== null;
  }

  function parseComment(fileName: string): PostComment | null {
    const filePath = join(rootDir, fileName);
    try {
      const comment = yaml.safeLoad(
        fs.readFileSync(filePath, 'utf8')
      ) as PostComment;
      return {
        ...comment,
        messageHtml: markdownToSimpleHtml(comment.message),
      };
    } catch (e) {
      logger.error(`Error parsing blog comment ${filePath}: ${e.message}`);
      return null;
    }
  }

  return fs.readdirSync(rootDir).map(parseComment).filter(notNull);
}

export function getPostBySlug(slug: string, fields: string[] = []): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const getData = (key: string): Post[keyof Post] => {
    switch (key) {
      case 'slug':
        return realSlug;
      case 'content':
        return content;
      case 'contentHtml':
        return markdownToHtml(content);
      case 'comments':
        return getComments(realSlug);
      default:
        return data[key];
    }
  };

  const post = fields.reduce<Partial<Post>>(
    (acc: Partial<Post>, field: string) => ({
      ...acc,
      [field]: getData(field),
    }),
    {}
  ) as Post;

  return post;
}

export function getAllPosts(fields: string[] = []): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug: string) => getPostBySlug(slug, fields))
    .sort((post1: Post, post2: Post) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllVisiblePosts(fields: string[] = []): Post[] {
  const fieldsWithDraftStatus = fields.slice().concat(['draft']);
  const visiblePosts = getAllPosts(fieldsWithDraftStatus).filter(
    (post: Post) => !post.draft
  );
  return visiblePosts;
}
