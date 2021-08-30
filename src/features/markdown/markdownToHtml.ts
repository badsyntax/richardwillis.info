import parse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import html from 'rehype-stringify';
import slug from 'rehype-slug';
import { unified } from 'unified';
import autolinkHeadings from 'rehype-autolink-headings';
import externalLinks from 'remark-external-links';
// @ts-ignore
import rehypePrism from '@mapbox/rehype-prism';

import rehypePicture from './reypePicture';

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
    // TODO: add webp format
    .use(rehypePicture, {
      png: {
        sizes: [420, 640, 768, 1024, 1280],
        formats: { png: 'image/png' },
      },
      jpg: {
        sizes: [420, 640, 768, 1024, 1280],
        formats: { jpg: 'image/jpg' },
      },
    })
    .processSync(markdown);
  return result.toString();
};
