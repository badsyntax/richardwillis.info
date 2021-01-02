import React from 'react';
import { useRouter } from 'next/router';
import { Typography } from '../../layout/Typography/Typography';

function isAnchorElement(target: EventTarget): target is HTMLAnchorElement {
  return target instanceof Element && target.nodeName === 'A';
}

export type MarkdownContentProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  content: string;
};

export const MarkdownContent: React.FunctionComponent<MarkdownContentProps> = ({
  content,
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
    <Typography
      as="div"
      variant="prose"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
};
