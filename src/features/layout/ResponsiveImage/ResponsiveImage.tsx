/* eslint-disable @next/next/no-img-element */
import React from 'react';
import classNames from 'classnames/bind';

import { SIZE } from './constants';
import { SourceFormats } from './SourceFormats';
import { getImageType, getImageSize, getResizedUrl } from './util';
import STYLES from './ResponsiveImage.module.scss';
const classes = classNames.bind(STYLES);

export type ImageProps = Omit<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >,
  'loading'
> & {
  onLoad?: () => void;
  size?: SIZE;
};

export const ResponsiveImage = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      width,
      alt,
      size = width ? getImageSize(Number(width)) : SIZE.MAX,
      ...props
    },
    imageRef
  ) => {
    if (!src) {
      return null;
    }
    const type = getImageType(src);
    // const size = width ? getImageSize(Number(width)) : SIZE.XL;
    const resizedSrc = getResizedUrl(src, type, size);

    return (
      <a href={src} className={classes('root')}>
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
      </a>
    );
  }
);

ResponsiveImage.displayName = 'ResponsiveImage';
