import { GetStaticProps } from 'next';
import { getSanitisedResponse } from '../features/api/apiClient';
import { AboutpageSeo } from '../features/api/strapi';
import { getContactPage } from '../features/contact/api';
import { getMdxSource } from '../features/mdx/util';
import { ContactPageProps } from '../features/pages/ContactPage/ContactPage';

export { ContactPage as default } from '../features/pages/ContactPage/ContactPage';

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  const contactPage = await getContactPage();
  const { body = '', seo } = contactPage;
  const mdxSource = await getMdxSource(body);
  return {
    props: {
      mdxSource,
      seo: getSanitisedResponse<AboutpageSeo>(seo),
    },
  };
};
