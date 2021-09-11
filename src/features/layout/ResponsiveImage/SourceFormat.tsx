import React from 'react';
import { SourceFormatType, SIZE } from './constants';
import { getSourceFormatValues } from './util';

export type SourceFormatProps = React.DetailedHTMLProps<
  React.SourceHTMLAttributes<HTMLSourceElement>,
  HTMLSourceElement
> & {
  src: string;
  type: SourceFormatType;
  size: SIZE;
};

export const SourceFormat: React.FunctionComponent<SourceFormatProps> = ({
  src,
  type,
  size,
  ...props
}) => {
  const { srcSet, contentType, sizes } = getSourceFormatValues(src, type, size);
  const newProps = {
    srcSet,
    type: contentType,
    sizes,
  };
  return <source {...props} {...newProps} />;
};
