import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// @ts-expect-error
import addClasses from 'rehype-add-classes';
import * as styles from '../layout/Typography/Typography.css';
import { root as linkStyle } from '../layout/Link/Link.css';

// @ts-expect-error
import rehypePrism from '@mapbox/rehype-prism';

export function getMdxSource(
  markdown: string
): Promise<MDXRemoteSerializeResult<Record<string, unknown>>> {
  return serialize(markdown, {
    mdxOptions: {
      rehypePlugins: [
        [
          addClasses,
          {
            hr: styles.variantHr,
            h1: styles.variantH1,
            h2: styles.variantH2,
            h3: styles.variantH3,
            p: styles.variantP,
            a: linkStyle,
          },
        ],
        rehypeSlug,
        rehypeExternalLinks,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
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
          },
        ],
      ],
    },
  });
}
