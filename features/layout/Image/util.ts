import { SIZE, SourceFormatType } from './constants';

export function getImageSizes(size: SIZE): string {
  const sizes = getSourceFormatSizes(size);
  const lastSize = sizes.pop();
  return sizes
    .map((sourceSize) => {
      return `(max-width: ${sourceSize}px) ${sourceSize}px`;
    })
    .concat([`${lastSize}px`])
    .join(',\n');
}

export function getResizedUrl(
  src: string,
  type: SourceFormatType,
  width: SIZE = SIZE.XL,
  pathPrefix = 'resized'
): string {
  const urlParts = src.split('/');
  const filename = urlParts.pop();
  const filenameParts = filename.split('.');
  filenameParts.pop();
  const filenameWithWidth = `${filenameParts.join('.')}-${width}`;
  const newFilename = `${filenameWithWidth}.${type}`;
  urlParts.push(pathPrefix);
  return urlParts.concat([newFilename]).join('/');
}

export function getSrcSet(
  src: string,
  sizes: SIZE[],
  type: SourceFormatType
): string {
  return sizes
    .map((size) => {
      const resizedSrc = getResizedUrl(src, type, size);
      return `${resizedSrc} ${size}w`;
    })
    .join(', ');
}

export function getImageSize(width: number): SIZE {
  if (!width) {
    return SIZE.XL;
  }
  if (width <= SIZE.SM) {
    return SIZE.SM;
  }
  if (width <= SIZE.MD) {
    return SIZE.MD;
  }
  if (width <= SIZE.LG) {
    return SIZE.LG;
  }
  return SIZE.XL;
}

export function getImageType(src: string): SourceFormatType {
  const extension = src.split('.').pop();
  return SourceFormatType[extension];
}

export function getContentType(type: SourceFormatType): string {
  switch (type) {
    case 'jpg':
      return `image/jpg`;
    case 'webp':
      return `image/webp`;
  }
}

export function getSourceFormatValues(
  src: string,
  type: SourceFormatType,
  size: SIZE
): {
  media?: string;
  srcSet: string;
  contentType: string;
} {
  return {
    srcSet: getResizedUrl(src, type, size),
    contentType: getContentType(type),
    media: `(max-width: ${size}px)`,
  };
}

export function getSourceFormatSizes(size: SIZE): SIZE[] {
  const defaultSizes = [SIZE.SM, SIZE.MD, SIZE.LG, SIZE.XL];
  if (size <= SIZE.SM) {
    return [SIZE.SM];
  }
  if (size <= SIZE.MD) {
    return [SIZE.SM, SIZE.MD];
  }
  if (size <= SIZE.LG) {
    return [SIZE.SM, SIZE.MD, SIZE.LG];
  }
  return defaultSizes;
}
