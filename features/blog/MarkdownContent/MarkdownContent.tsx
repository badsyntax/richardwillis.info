import React from 'react';
import { Typography } from '../../layout/Typography/Typography';

export interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FunctionComponent<MarkdownContentProps> = ({
  content,
  className,
}) => {
  return (
    <Typography
      as="div"
      variant="prose"
      className={className}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
