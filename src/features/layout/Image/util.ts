import { SIZE, SIZE_BREAKPOINTS, SourceFormatType } from './constants';

export function getSizes(size: SIZE): SIZE[] {
  return SIZE_BREAKPOINTS.filter((breakpoint) => size >= breakpoint);
}

export function getImageSizes(size: SIZE): string {
  const sizes = getSizes(size);
  const lastSize = sizes.pop();
  return sizes
    .map((sourceSize) => {
      return `(max-width: ${sourceSize}px) ${sourceSize}px`;
    })
    .concat([`${lastSize}px`])
    .join(',\n');
}

export function getImageSrcSet(
  src: string,
  size: SIZE,
  type: SourceFormatType
): string {
  return getSizes(size)
    .map((size) => `${getResizedUrl(src, type, size)} ${size}w`)
    .join(', ');
}

export function getResizedUrl(
  src: string,
  type: SourceFormatType,
  width: SIZE = SIZE.XL,
  pathPrefix = 'resized'
): string {
  const urlParts = src.split('/');
  const filename = urlParts.pop();
  if (!filename) {
    throw new Error(`invalid image path: ${src}`);
  }
  const filenameParts = filename.split('.');
  filenameParts.pop();
  const filenameWithWidth = `${filenameParts.join('.')}-${width}`;
  const newFilename = `${filenameWithWidth}.${type}`;
  urlParts.push(pathPrefix);
  return urlParts.concat([newFilename]).join('/');
}

export function getImageSize(width: number): SIZE {
  const defaultSize = SIZE.XL;
  if (!width) {
    return defaultSize;
  }
  return (
    SIZE_BREAKPOINTS.find((breakpoint) => width <= breakpoint) || defaultSize
  );
}

export function getImageType(src: string): SourceFormatType {
  function isValidSourceFormatType(
    value: string
  ): value is keyof typeof SourceFormatType {
    return value in SourceFormatType;
  }
  const extension = src.split('.').pop();
  if (!extension || !isValidSourceFormatType(extension)) {
    throw new Error(`invalid image extension: ${src}`);
  }
  return SourceFormatType[extension];
}

export function getImageContentType(type: SourceFormatType): string {
  switch (type) {
    case 'jpg':
      return `image/jpg`;
    case 'webp':
      return `image/webp`;
    default:
      throw new Error(`Unsupported image type: ${type}`);
  }
}

export function getSourceFormatValues(
  src: string,
  type: SourceFormatType,
  size: SIZE
): {
  contentType: string;
  srcSet: string;
  sizes: string;
} {
  return {
    srcSet: getImageSrcSet(src, size, type),
    contentType: getImageContentType(type),
    sizes: getImageSizes(size),
  };
}
