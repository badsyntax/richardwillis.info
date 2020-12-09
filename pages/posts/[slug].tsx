import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';
import Head from 'next/head';
import { PageShell } from '../../features/layout/PageShell/PageShell';
import { PostTitle } from '../../features/blog/PostTitle/PostTitle';
import { markdownToHtml } from '../../features/blog/markdownToHtml';
import { PostHeader } from '../../features/blog/PostHeader/PostHeader';
import { PostBody } from '../../features/blog/PostBody/PostBody';
import { getAllPosts, getPostBySlug } from '../../features/blog/api';
import { Post } from '../../features/blog/types';

export interface PostPagePros {
  post: Post;
  morePosts: boolean;
  preview: boolean;
}

const PostPage: React.FunctionComponent<PostPagePros> = ({
  post,
  morePosts,
  preview,
}) => {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <PageShell preview={preview} title={`Blog - ${post.title}`}>
      {router.isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <>
          <article>
            <Head>
              <meta property="og:image" content={post.ogImage.url} />
            </Head>
            <PostHeader
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
            />
            <PostBody content={post.content} />
          </article>
        </>
      )}
    </PageShell>
  );
};

export default PostPage;

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
    'coverImage',
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
