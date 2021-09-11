import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { AboutPageProps } from '../features/about/AboutPage/AboutPage';

export { AboutPage as default } from '../features/about/AboutPage/AboutPage';
import { apiClient } from '../features/api/apiClient';
import { Aboutpage } from '../features/api/strapi/models/Aboutpage';

export async function getAboutPage(): Promise<Aboutpage> {
  return await apiClient.aboutpageApi.aboutpageGet({});
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const aboutPage = await getAboutPage();
  const { body = '' } = aboutPage;
  const mdxSource = await serialize(body);
  return {
    props: { body, mdxSource },
  };
};
