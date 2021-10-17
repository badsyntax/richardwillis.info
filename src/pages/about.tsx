import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { AboutPageProps } from '../features/about/AboutPage/AboutPage';
import { getAboutPage } from '../features/about/api';
import { getSanitisedResponse } from '../features/api/apiClient';
import { AboutpageSeo } from '../features/api/strapi';

export { AboutPage as default } from '../features/about/AboutPage/AboutPage';

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const aboutPage = await getAboutPage();
  const { body = '', seo } = aboutPage;
  const mdxSource = await serialize(body);
  return {
    props: { mdxSource, seo: getSanitisedResponse<AboutpageSeo>(seo) },
  };
};
