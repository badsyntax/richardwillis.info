import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';
import { unified } from 'unified';

export const markdownToSimpleHtml = (markdown: string): string => {
  const result = unified()
    .use(parse)
    .use(remark2rehype)
    .use(rehypePrism)
    .use(html)
    .processSync(markdown);
  return result.toString();
};
