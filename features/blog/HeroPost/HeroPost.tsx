import React from 'react';
import { Link } from '../../layout/Link/Link';
import { Avatar } from '../Avatar/Avatar';
import { CoverImage } from '../CoverImage/CoverImage';
import { Author } from '../types';

export interface HeroPostProps {
  title: string;
  coverImage: string;
  date: string;
  excerpt: string;
  author: Author;
  slug: string;
}

export const HeroPost: React.FunctionComponent<HeroPostProps> = ({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}) => {
  return (
    <section>
      <div>
        <CoverImage title={title} src={coverImage} slug={slug} />
      </div>
      <div>
        <div>
          <h3>
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h3>
          <div>{/* <DateFormatter dateString={date} /> */}</div>
        </div>
        <div>
          <p>{excerpt}</p>
          <Avatar name={author.name} picture={author.picture} />
        </div>
      </div>
    </section>
  );
};
