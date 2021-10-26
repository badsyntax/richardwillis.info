import { GetStaticProps } from 'next';
import { AboutPageProps } from '../features/about/AboutPage/AboutPage';
import { getAboutPage } from '../features/about/api';
import { getSanitisedResponse } from '../features/api/apiClient';
import { AboutpageSeo } from '../features/api/strapi';
import { getMdxSource } from '../features/mdx/util';

export { AboutPage as default } from '../features/about/AboutPage/AboutPage';

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const aboutPage = await getAboutPage();
  const { body = '', seo } = aboutPage;
  const mdxSource = await getMdxSource(body);
  return {
    props: { mdxSource, seo: getSanitisedResponse<AboutpageSeo>(seo) },
  };
};
