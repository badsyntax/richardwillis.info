import classNames from 'classnames/bind';
import { Typography } from '../../layout/Typography/Typography';
import STYLES from './PostTitle.module.css';
const classes = classNames.bind(STYLES);

export const PostTitle: React.FunctionComponent = ({ children }) => {
  return (
    <Typography as="h1" className={classes('root')}>
      {children}
    </Typography>
  );
};
