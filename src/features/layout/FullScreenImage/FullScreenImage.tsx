import React, { useRef, useState } from 'react';
import classNames from 'classnames/bind';

import { Image, ImageProps } from '../Image/Image';
import { EllipsisSpinner } from '../EllipsisSpinner/EllipsisSpinner';

import STYLES from './FullScreenImage.module.css';
const classes = classNames.bind(STYLES);

export type FullScreenImageProps = Omit<ImageProps, 'onLoad'>;

export const FullScreenImage: React.FunctionComponent<FullScreenImageProps> = (
  props
) => {
  const [src, setSrc] = useState<string | undefined>();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const ref = useRef<HTMLImageElement>(null);
  const onImageLoad = () => setImageLoaded(true);

  if (props.src && props.src !== src) {
    setSrc(props.src);
    setImageLoaded(false);
  }

  const isLoaded = props.src === src && imageLoaded;

  return (
    <section className={classes('root')}>
      <Image
        {...props}
        src={src}
        className={classes('image')}
        ref={ref}
        onLoad={onImageLoad}
      />
      <footer className={classes('footer')}>
        {isLoaded ? (
          <div className={classes('description')}>{props.alt}</div>
        ) : (
          <EllipsisSpinner />
        )}
      </footer>
    </section>
  );
};
