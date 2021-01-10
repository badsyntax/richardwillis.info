import React, { Fragment, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import classNames from 'classnames/bind';

import { Link } from '../Link/Link';
import { Modal } from '../Modal/Modal';
import { Image } from '../Image/Image';
import { FullScreenImage } from '../FullScreenImage/FullScreenImage';

import STYLES from './ImageGallery.module.css';
import { DialogButton } from '../Modal/DialogButton';
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
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const onModalClose = () => setSelectedImage(null);
  const onItemClick = (image: Image) => (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setSelectedImage(image);
  };
  const onNextButtonClick = () => {
    if (!selectedImage) {
      return;
    }
    const curIndex = images.indexOf(selectedImage);
    setSelectedImage(images[curIndex + 1]);
  };
  const onPrevButtonClick = () => {
    if (!selectedImage) {
      return;
    }
    const curIndex = images.indexOf(selectedImage);
    setSelectedImage(images[curIndex - 1]);
  };
  const prevButtonVisible = selectedImage && images.indexOf(selectedImage) > 0;
  const nextButtonVisible =
    selectedImage && images.indexOf(selectedImage) < images.length - 1;
  return (
    <Fragment>
      <Modal open={!!selectedImage} onClose={onModalClose}>
        {selectedImage && (
          <Fragment>
            <FullScreenImage src={selectedImage.src} alt={selectedImage.alt} />
            {prevButtonVisible && (
              <DialogButton className={classes('arrow-left')}>
                <FiArrowLeft onClick={onPrevButtonClick} />
              </DialogButton>
            )}
            {nextButtonVisible && (
              <DialogButton className={classes('arrow-right')}>
                <FiArrowRight onClick={onNextButtonClick} />
              </DialogButton>
            )}
          </Fragment>
        )}
      </Modal>
      <ul className={classes('root')}>
        {images.map((image, i) => {
          return (
            <li className={classes('item')} key={i}>
              <Link
                href={image.src}
                target="_blank"
                rel="noopener"
                onClick={onItemClick(image)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={width}
                  height={height}
                  className={classes('image')}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};
