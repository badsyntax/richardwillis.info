import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Post } from './types';

const postsDirectory = join(process.cwd(), 'blog');

export function getPostSlugs(): string[] {
  return fs.readdirSync(postsDirectory);
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
      default:
        return data[key];
    }
  };

  const items = fields.reduce(
    (previousValue: Record<string, string>, currentValue: string) =>
      Object.assign({}, previousValue, {
        [currentValue]: getData(currentValue),
      }),
    {}
  );

  return items;
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
