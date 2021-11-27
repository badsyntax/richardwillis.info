import React from 'react';
import classNames from 'classnames/bind';
import { Box, BoxChildClasses, BoxProps } from '../Box/Box';
// import { root as linkStyle } from '../Link/Link.css';
import { capitalizeFirstLetter } from '../../util/capitalizeFirstLetter';

import * as styles from './Typography.css.stitches';

export type Variant = 'p' | 'h1' | 'h2' | 'h3' | 'prose' | 'hr';

export type TypographyProps = BoxProps & {
  as?: Variant;
  variant?: Variant;
  addChildClasses?: boolean;
};

const childClasses: {
  [key in Variant]: string;
} = {
  h1: styles.variantH1(),
  h2: styles.variantH2(),
  h3: styles.variantH3(),
  p: styles.variantP(),
  hr: styles.variantHr(),
  prose: styles.variantProse(),
  // a: linkStyle,
};

export const Typography: React.FC<TypographyProps> = ({
  children,
  className,
  as = 'p',
  variant = as,
  addChildClasses = false,
  ...rest
}) => {
  if (addChildClasses && variant !== 'prose') {
    throw new Error('Variant must be prose to add child classes');
  }
  const variantClassName = childClasses[variant];

  console.log('variantClassName', variantClassName);

  return (
    <Box<HTMLElement>
      className={classNames(styles.root(), variantClassName, className)}
      as={as}
      // childClasses={
      //   variant === 'prose' && addChildClasses ? childClasses : undefined
      // }
      {...rest}>
      {children}
    </Box>
  );
};
