import unified from 'unified';
import classNames from 'classnames/bind';
import STYLES from './PostBody.module.css';
import { MarkdownContent } from '../MarkdownContent/MarkdownContent';
const classes = classNames.bind(STYLES);

export interface PostBodyProps {
  content: string;
}

export const PostBody: React.FunctionComponent<PostBodyProps> = ({
  content,
}) => {
  return <MarkdownContent content={content} className={classes('root')} />;
};
