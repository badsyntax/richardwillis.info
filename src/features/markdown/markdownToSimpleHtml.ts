import { VFileCompatible } from 'vfile';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import rehypePrism from '@mapbox/rehype-prism';

export const markdownToSimpleHtml = (markdown: VFileCompatible): string => {
  const result = unified()
    .use(parse)
    .use(remark2rehype)
    .use(rehypePrism)
    .use(html)
    .processSync(markdown);
  return result.toString();
};
