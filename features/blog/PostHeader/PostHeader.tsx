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
      <div className="hidden md:block md:mb-12">
        <Avatar name={author.name} picture={author.picture} />
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          <Avatar name={author.name} picture={author.picture} />
        </div>
        <div className="mb-6 text-lg">
          {/* <DateFormatter dateString={date} /> */}
        </div>
      </div>
    </>
  );
};
