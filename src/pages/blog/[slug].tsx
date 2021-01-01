import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug } from '../../features/blog/api';
import { markdownToHtml } from '../../features/markdown/markdownToHtml';

export { PostPage as default } from '../../features/blog/PostPage/PostPage';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (Array.isArray(params.slug)) {
    return null;
  }
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
  ]);
  const content = await markdownToHtml(post.content || '');

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};
