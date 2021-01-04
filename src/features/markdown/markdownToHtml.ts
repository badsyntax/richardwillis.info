import { VFileCompatible } from 'vfile';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import slug from 'rehype-slug';
import autolinkHeadings from 'rehype-autolink-headings';
import externalLinks from 'remark-external-links';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore no types defined
import rehypePrism from '@mapbox/rehype-prism';

export const markdownToHtml = (markdown: VFileCompatible): string => {
  const result = unified()
    .use(parse)
    .use(externalLinks, { target: false, rel: ['nofollow'] })
    .use(remark2rehype)
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
