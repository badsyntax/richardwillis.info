import React from 'react';

const MAX_WIDTH = 1280;
const SIZE_SM = 200;
const SIZE_MD = 725;
const SIZE_LG = 1075;
const SIZE_XL = MAX_WIDTH;
const SIZE_BREAKPOINTS = [SIZE_SM, SIZE_MD, SIZE_LG, SIZE_XL];

const imgSizes = `(max-width: 300px) ${SIZE_SM}px,
  (max-width: 768px) ${SIZE_MD}px,
  (max-width: 1024px) ${SIZE_LG}px,
  (max-width: ${MAX_WIDTH}px) 100vw,
  ${SIZE_XL}px`;

function getResizedUrl(
  src: string,
  width: string,
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
      const resizedSrc = getResizedUrl(src, String(size));
      return `${resizedSrc} ${size}w`;
    })
    .join(', ');
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
  const smallSrc = getResizedUrl(src, String(SIZE_SM));
  const srcSet = getSrcSet(src, SIZE_BREAKPOINTS);
  return (
    <img
      {...props}
      width={width}
      alt={alt}
      src={smallSrc}
      sizes={imgSizes}
      srcSet={srcSet}
      loading="lazy"
    />
  );
};
