import React from 'react';
import classNames from 'classnames/bind';
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';

import STYLES from './PostBody.module.scss';
const classes = classNames.bind(STYLES);

export interface PostBodyProps {
  content: string;
}

export const PostBody: React.FC<PostBodyProps> = ({ content }) => {
  return <MarkdownContent content={content} className={classes('root')} />;
};
