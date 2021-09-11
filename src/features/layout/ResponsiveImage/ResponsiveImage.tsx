import React from 'react';
import Image, { ImageLoaderProps } from 'next/image';

function getResizedUrl(url: string, width?: string | number): string {
  const parts = url.split('/');
  const filename = parts.pop();
  return parts.concat([`${width}_${filename}`]).join('/');
}

function responsiveImageLoader({
  src,
  width,
  quality: _quality,
}: ImageLoaderProps): string {
  if (typeof src === 'string') {
    return getResizedUrl(src, width);
  }
  return src;
}

type ResponsiveImageProps = React.ComponentProps<typeof Image>;

export const ResponsiveImage: React.FC<ResponsiveImageProps> = (props) => {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image {...props} loader={responsiveImageLoader} layout="responsive" />
  );
};
