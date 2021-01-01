import { VFileCompatible } from 'vfile';
import unified from 'unified';
import parse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import rehypePrism from '@mapbox/rehype-prism';
import slug from 'rehype-slug';
import autolinkHeadings from 'rehype-autolink-headings';
import externalLinks from 'remark-external-links';

export const markdownToHtml = async (
  markdown: VFileCompatible
): Promise<string> => {
  const result = await unified()
    .use(parse)
    .use(externalLinks, { target: false, rel: ['nofollow'] })
    .use(remark2rehype)
    .use(rehypePrism)
    .use(slug)
    .use(autolinkHeadings, {
      properties: {
        className: 'anchor',
        ariaHidden: true,
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
    .process(markdown);
  return result.toString();
};
