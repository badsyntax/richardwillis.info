import React, { useEffect } from 'react';
import classNames from 'classnames/bind';

import STYLES from './PostBodyEditor.module.css';
import { getBlogPostContents } from '../../apiClient/apiClient';
const classes = classNames.bind(STYLES);

export interface PostBodyEditorProps {
  slug: string;
  markdown?: string;
  setMarkdown: (markdown: string) => void;
}

export const PostBodyEditor: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > &
    PostBodyEditorProps
> = ({ slug, markdown, setMarkdown, ...props }) => {
  const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMarkdown(e.target.value);
  useEffect(() => {
    if (!markdown) {
      getBlogPostContents(slug).then(setMarkdown, (err: Error) =>
        console.error(err)
      );
    }
  }, [markdown, setMarkdown, slug]);
  return (
    <textarea
      className={classes('editor')}
      value={markdown}
      onChange={onContentChange}
      {...props}
    />
  );
};
