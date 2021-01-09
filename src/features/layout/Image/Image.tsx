import React from 'react';
import { SIZE } from './constants';
import { SourceFormats } from './SourceFormats';
import { getImageType, getImageSize, getResizedUrl } from './util';

export type ImageProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'loading'
> & {
  onLoad?: () => void;
};

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, width, alt, ...props }, imageRef) => {
    if (!src) {
      return null;
    }
    const type = getImageType(src);
    const size = width ? getImageSize(Number(width)) : SIZE.XL;
    const resizedSrc = getResizedUrl(src, type, size);

    return (
      <picture>
        <SourceFormats src={src} size={size} origType={type} />
        <img
          loading="lazy"
          {...props}
          width={width}
          alt={alt}
          src={resizedSrc}
          ref={imageRef}
        />
      </picture>
    );
  }
);
