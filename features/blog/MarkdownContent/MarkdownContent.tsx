import React from 'react';

export interface MarkdownContentProps {
  content: string;
  className?: string;
}

export const MarkdownContent: React.FunctionComponent<MarkdownContentProps> = ({
  content,
  className,
}) => {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
  );
};
