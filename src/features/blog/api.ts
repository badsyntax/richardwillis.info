import fs from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';
import matter from 'gray-matter';
import { Post, PostComment } from './types';
import { logger } from '../logger/logger';
import { markdownToSimpleHtml } from '../markdown/markdownToSimpleHtml';

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
  return fs
    .readdirSync(rootDir)
    .map<PostComment | null>((fileName: string) => {
      const filePath = join(rootDir, fileName);
      try {
        return yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) as PostComment;
      } catch (e) {
        logger.error(`Error parsing blog comment ${filePath}: ${e.message}`);
        return null;
      }
    })
    .filter((comment) => comment !== null)
    .map((comment) => {
      return {
        ...comment,
        messageHtml: markdownToSimpleHtml(comment.message),
      };
    });
}

export function getPostBySlug(slug: string, fields = []): Post {
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
      case 'comments':
        return getComments(realSlug);
      default:
        return data[key];
    }
  };

  const post = fields.reduce(
    (acc: Record<string, Post[keyof Post]>, field: string) => ({
      ...acc,
      [field]: getData(field),
    }),
    {}
  );

  return post;
}

export function getAllPosts(fields = []): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug: string) => getPostBySlug(slug, fields))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllVisiblePosts(fields = []): Post[] {
  const fieldsWithDraftStatus = fields.slice().concat(['draft']);
  const visiblePosts = getAllPosts(fieldsWithDraftStatus).filter(
    (post: Post) => !post.draft
  );
  return visiblePosts;
}
