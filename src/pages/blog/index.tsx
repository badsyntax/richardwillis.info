import { GetStaticProps } from 'next';
import { getAllArticles } from '../../features/blog/api';

export { BlogPage as default } from '../../features/blog/BlogPage/BlogPage';

import { BlogPageProps } from '../../features/blog/BlogPage/BlogPage';

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const allArticles = await getAllArticles();
  return {
    props: { allArticles },
  };
};
