// import DateFormatter from '../components/date-formatter';
import React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { CoverImage } from '../CoverImage/CoverImage';
import { PostTitle } from '../PostTitle/PostTitle';
import { Author } from '../types';

interface PostHeaderProps {
  title: string;
  coverImage: string;
  date: string;
  author: Author;
}

export const PostHeader: React.FunctionComponent<PostHeaderProps> = ({
  title,
  coverImage,
  date,
  author,
}) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <div>
        <Avatar name={author.name} picture={author.picture} />
      </div>
      <div>
        <CoverImage title={title} src={coverImage} />
      </div>
      <div>
        <div>
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div>{/* <DateFormatter dateString={date} /> */}</div>
      </div>
    </>
  );
};
