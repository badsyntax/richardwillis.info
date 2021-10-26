import React from 'react';
import { Typography } from '../../layout/Typography/Typography';

export const PostTitle: React.FC = (props) => {
  return <Typography as="h1" {...props} />;
};
