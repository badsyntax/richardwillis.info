import React from 'react';
import { Link } from '../../layout/Link/Link';
import { Typography } from '../../layout/Typography/Typography';
import { Avatar } from '../Avatar/Avatar';
import { Author } from '../types';

export interface PostPreviewProps {
  title: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
}

export const PostPreview: React.FunctionComponent<PostPreviewProps> = ({
  title,
  date,
  excerpt,
  author,
  slug,
}) => {
  return (
    <div>
      <Typography as="h3">
        <Link href={`/posts/${slug}`}>{title}</Link>
      </Typography>
      <div>{/* <DateFormatter dateString={date} /> */}</div>
      <p>{excerpt}</p>
      <Avatar name={author.name} picture={author.picture} />
    </div>
  );
};
