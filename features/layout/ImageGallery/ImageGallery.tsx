import React, { Fragment, useState } from 'react';
import classNames from 'classnames/bind';
import Image from 'next/image';

import { Link } from '../Link/Link';
import { Modal } from '../Modal/Modal';

import STYLES from './ImageGallery.module.css';
import { ImageLoader } from '../ImageLoader/ImageLoader';
const classes = classNames.bind(STYLES);

export interface Image {
  src: string;
  alt: string;
}

export interface ImageGalleryProps {
  images: Image[];
  width: number;
  height: number;
}

export const ImageGallery: React.FunctionComponent<ImageGalleryProps> = ({
  images,
  width,
  height,
}) => {
  const [selectedImage, setSelectedImage] = useState<Image>(null);
  const onModalClose = () => setSelectedImage(null);
  const onItemClick = (image: Image) => (e) => {
    return;
    // e.preventDefault();
    // setSelectedImage(image);
  };
  return (
    <Fragment>
      <Modal open={!!selectedImage} onClose={onModalClose}>
        <ImageLoader
          src={selectedImage?.src}
          alt={selectedImage?.alt}
          layout="responsive"
          width={400}
          height={300}
        />
      </Modal>
      <ul className={classes('root')}>
        {images.map((image, i) => (
          <li className={classes('item')} style={{ height }} key={i}>
            <Link href={image.src} target="_blank" onClick={onItemClick(image)}>
              <Image
                src={image.src}
                alt={image.alt}
                width={width}
                height={height}
                className={classes('image')}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};
