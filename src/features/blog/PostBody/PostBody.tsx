import React from 'react';
import classNames from 'classnames/bind';
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';

import STYLES from './PostBody.module.css';
const classes = classNames.bind(STYLES);

export interface PostBodyProps {
  content: string;
}

export const PostBody: React.FunctionComponent<PostBodyProps> = ({
  content,
}) => {
  return <MarkdownContent content={content} className={classes('root')} />;
};
