import React from 'react';
import { SourceFormats } from './SourceFormats';
import { getImageType, getImageSize, getResizedUrl } from './util';

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
  const size = getImageSize(width && Number(width));
  const resizedSrc = getResizedUrl(src, type, size);
  return (
    <picture>
      <SourceFormats src={src} size={size} origType={type} />
      <img {...props} width={width} alt={alt} src={resizedSrc} loading="lazy" />
    </picture>
  );
};
