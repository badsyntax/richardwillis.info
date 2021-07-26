import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPosts, getPostBySlug } from '../../features/blog/api';
// import { allPosts } from '../../features/blog/posts';
// import { getAllPosts, getPostBySlug } from '../../features/blog/api';

export { PostPage as default } from '../../features/blog/PostPage/PostPage';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // return {
  //   props: {
  //     post: allPosts.find((post) => post.slug === params?.slug),
  //   },
  // };
  if (!params || !params.slug || Array.isArray(params.slug)) {
    return {
      props: {},
    };
  }

  const post = await getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'contentHtml',
    'comments',
    'excerpt',
    'ogImage',
  ]);

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // return {
  //   paths: [],
  //   fallback: false,
  // };

  const posts = await getAllPosts(['slug']);

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
