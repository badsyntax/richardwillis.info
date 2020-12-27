import React from 'react';

enum SIZES {
  SM = 200,
  MD = 725,
  LG = 1075,
  XL = 1280,
}

const SIZE_BREAKPOINTS = [SIZES.SM, SIZES.MD, SIZES.LG, SIZES.XL];

function getImageSizes(size: SIZES) {
  if (size <= SIZES.SM) {
    return `(max-width: 300px) ${SIZES.SM}px,
      ${SIZES.SM}px`;
  }
  if (size <= SIZES.MD) {
    return `(max-width: 300px) ${SIZES.SM}px,
      (max-width: 768px) ${SIZES.MD}px,
      ${SIZES.MD}px`;
  }
  if (size <= SIZES.LG) {
    return `(max-width: 300px) ${SIZES.SM}px,
      (max-width: 768px) ${SIZES.MD}px,
      (max-width: 1024px) ${SIZES.LG}px,
      ${SIZES.LG}px`;
  }
  return `(max-width: 300px) ${SIZES.SM}px,
    (max-width: 768px) ${SIZES.MD}px,
    (max-width: 1024px) ${SIZES.LG}px,
    (max-width: ${SIZES.XL}px) 100vw,
    ${SIZES.XL}px`;
}

function getResizedUrl(
  src: string,
  width: SIZES = SIZES.XL,
  pathPrefix = 'resized'
): string {
  const urlParts = src.split('/');
  const filename = urlParts.pop();
  const filenameParts = filename.split('.');
  const filenameExtension = filenameParts.pop();
  const filenameWithWidth = `${filenameParts.join('.')}-${width}`;
  const newFilename = `${filenameWithWidth}.${filenameExtension}`;
  urlParts.push(pathPrefix);
  return urlParts.concat([newFilename]).join('/');
}

function getSrcSet(src: string, sizes: number[]): string {
  return sizes
    .map((size) => {
      const resizedSrc = getResizedUrl(src, size);
      return `${resizedSrc} ${size}w`;
    })
    .join(', ');
}

function getImageSize(width: number): SIZES {
  if (!width) {
    return undefined;
  }
  if (width <= SIZES.SM) {
    return SIZES.SM;
  }
  if (width <= SIZES.MD) {
    return SIZES.MD;
  }
  if (width <= SIZES.LG) {
    return SIZES.LG;
  }
  return SIZES.LG;
}

export type ImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export const Image: React.FunctionComponent<ImageProps> = ({
  src,
  width,
  alt,
  ...props
}) => {
  const imageSize = getImageSize(Number(width));
  const resizedSrc = getResizedUrl(src, imageSize);
  const imgSizes = getImageSizes(imageSize);
  return (
    <img
      {...props}
      width={width}
      alt={alt}
      src={resizedSrc}
      sizes={imgSizes}
      srcSet={getSrcSet(src, SIZE_BREAKPOINTS)}
      loading="lazy"
    />
  );
};
