import parse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import html from 'rehype-stringify';
import slug from 'rehype-slug';
import { unified } from 'unified';

import autolinkHeadings from 'rehype-autolink-headings';
import externalLinks from 'remark-external-links';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';

export const markdownToHtml = (markdown: string): string => {
  const result = unified()
    .use(parse)
    .use(externalLinks, { target: false, rel: ['nofollow'] })
    .use(remarkRehype)
    .use(rehypePrism)
    .use(slug)
    .use(autolinkHeadings, {
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
    })
    .use(html)
    .processSync(markdown);
  return result.toString();
};
