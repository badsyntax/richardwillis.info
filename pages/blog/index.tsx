import { GetStaticProps } from 'next';
import { getAllPosts } from '../../features/blog/api';

export { BlogPage as default } from '../../features/blog/BlogPage/BlogPage';

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ]);
  return {
    props: { allPosts },
  };
};
