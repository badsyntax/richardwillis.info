import React, { Fragment } from 'react';
import { SIZE, SourceFormatType } from './constants';
import {
  getResizedUrl,
  getSourceFormatSizes,
  getSourceFormatValues,
} from './util';

export interface SourceFormatProps {
  src: string;
  size: SIZE;
  type: SourceFormatType;
  defaultSize: boolean;
}

export const SourceFormat: React.FunctionComponent<SourceFormatProps> = ({
  src,
  size,
  type,
  defaultSize,
}) => {
  const { media, srcSet, contentType } = getSourceFormatValues(src, type, size);

  const props = {
    srcSet,
    type: contentType,
    ...(!defaultSize && {
      media,
    }),
  };
  return <source {...props} />;
};

export interface SourceFormatsProps {
  src: string;
  size: SIZE;
  origType: SourceFormatType;
}

export const SourceFormats: React.FunctionComponent<SourceFormatsProps> = ({
  src,
  size,
  origType,
}) => {
  function renderSourceFormats(type: SourceFormatType) {
    const sizes = getSourceFormatSizes(size);
    return sizes.map((sourceSize, i) => (
      <SourceFormat
        src={src}
        size={sourceSize}
        type={type}
        key={`${src}-${type}-${sourceSize}`}
        defaultSize={i === sizes.length - 1}
      />
    ));
  }
  return (
    <Fragment>
      {origType !== SourceFormatType.webp &&
        renderSourceFormats(SourceFormatType.webp)}
      {renderSourceFormats(origType)}
    </Fragment>
  );
};
