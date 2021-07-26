import { GetStaticProps } from 'next';
import { getAllVisiblePosts } from '../../features/blog/api';

export { BlogPage as default } from '../../features/blog/BlogPage/BlogPage';

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllVisiblePosts([
    'title',
    'date',
    'slug',
    'author',
    'excerpt',
  ]);
  return {
    props: { allPosts },
  };
};
