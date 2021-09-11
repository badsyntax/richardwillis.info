import React from 'react';
import { useRouter } from 'next/router';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Typography } from '../../layout/Typography/Typography';
import { ResponsiveImage } from '../../layout/ResponsiveImage/ResponsiveImage';

function isAnchorElement(target: EventTarget): target is HTMLAnchorElement {
  return target instanceof Element && target.nodeName === 'A';
}

const components = { ResponsiveImage };

export type MarkdownContentProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  mdxSource,
  ...props
}) => {
  const router = useRouter();
  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    const { target } = event;
    if (
      isAnchorElement(target) &&
      !!target.pathname && // ignore "same page" anchor links
      target.host === window.location.host
    ) {
      event.preventDefault();
      await router.push(target.href);
      if (!target.hash) {
        window.scrollTo(0, 0);
      }
    }
  };
  return (
    <Typography as="div" variant="prose" onClick={handleClick} {...props}>
      <MDXRemote {...mdxSource} components={components} />
    </Typography>
  );
};
