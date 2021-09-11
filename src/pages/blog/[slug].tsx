import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllArticles, getArticleBySlug } from '../../features/blog/api';
import { PostPageProps } from '../../features/blog/PostPage/PostPage';
// import { allPosts } from '../../features/blog/posts';
// import { getAllPosts, getPostBySlug } from '../../features/blog/api';

export { PostPage as default } from '../../features/blog/PostPage/PostPage';

export const getStaticProps: GetStaticProps<PostPageProps> = async ({
  params,
}) => {
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

  const article = await getArticleBySlug(params.slug);

  return {
    props: {
      article,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  // return {
  //   paths: [],
  //   fallback: false,
  // };

  const articles = await getAllArticles();

  return {
    paths: articles.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
};
