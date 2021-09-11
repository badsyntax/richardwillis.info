import React, { Fragment } from 'react';
import { SIZE, SourceFormatType } from './constants';
import { SourceFormat } from './SourceFormat';

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
  function renderSourceFormatForType(type: SourceFormatType) {
    return <SourceFormat src={src} type={type} size={size} />;
  }
  return (
    <Fragment>
      {origType !== SourceFormatType.webp &&
        renderSourceFormatForType(SourceFormatType.webp)}
      {renderSourceFormatForType(origType)}
    </Fragment>
  );
};
