import cn from 'classnames';
import React from 'react';
import { Link } from '../../layout/Link/Link';

export interface CoverImageProps {
  title: string;
  src: string;
  slug?: string;
}

export const CoverImage: React.FunctionComponent<CoverImageProps> = ({
  title,
  src,
  slug,
}) => {
  return null;
  const image = src ? (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={src}
      alt={`Cover Image for ${title}`}
      className={cn('shadow-small', {
        'hover:shadow-medium transition-shadow duration-200': slug,
      })}
    />
  ) : null;
  return (
    <div className="sm:mx-0">
      {slug ? (
        <Link as={`/posts/${slug}`} href="/posts/[slug]" aria-label={title}>
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  );
};
