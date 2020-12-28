import React from 'react';
import { SIZE_BREAKPOINTS } from './constants';
import { SourceFormats } from './SourceFormats';
import {
  getImageType,
  getImageSize,
  getResizedUrl,
  getImageSizes,
  getSrcSet,
} from './util';

export type ImageProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'loading'
>;

export const Image: React.FunctionComponent<ImageProps> = ({
  src,
  width,
  alt,
  ...props
}) => {
  const type = getImageType(src);
  const imageSize = getImageSize(width && Number(width));
  const resizedSrc = getResizedUrl(src, type, imageSize);
  const imgSizes = getImageSizes(imageSize);

  return (
    <picture>
      <SourceFormats src={src} size={imageSize} origType={type} />
      <img
        {...props}
        width={width}
        alt={alt}
        src={resizedSrc}
        sizes={imgSizes}
        srcSet={getSrcSet(src, SIZE_BREAKPOINTS, type)}
        loading="lazy"
      />
    </picture>
  );
};
