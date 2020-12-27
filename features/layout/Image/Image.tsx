import React from 'react';

function getResizedUrl(
  src: string,
  width: string,
  pathPrefix = 'resized'
): string {
  const urlParts = src.split('/');
  const filename = urlParts.pop();
  const filenameParts = filename.split('.');
  const filenameExtension = filenameParts.pop();
  // filenameParts.push(width, filenameExtension);
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
> & {
  sizes?: number[];
  alt: string;
};

export const Image: React.FunctionComponent<ImageProps> = ({
  src,
  alt,
  sizes = [300, 768, 1280],
  ...props
}) => {
  const smallSrc = getResizedUrl(src, String(sizes[0]));
  const srcSet = getSrcSet(src, sizes);
  return <img {...props} alt={alt} src={smallSrc} srcSet={srcSet} />;
};
