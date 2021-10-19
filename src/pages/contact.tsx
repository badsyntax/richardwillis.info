import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { getSanitisedResponse } from '../features/api/apiClient';
import { AboutpageSeo } from '../features/api/strapi';
import { getContactPage } from '../features/contact/api';
import { ContactPageProps } from '../features/contact/ContactPage/ContactPage';

export { ContactPage as default } from '../features/contact/ContactPage/ContactPage';

export const getStaticProps: GetStaticProps<ContactPageProps> = async () => {
  const contactPage = await getContactPage();
  const { body = '', seo } = contactPage;
  const mdxSource = await serialize(body);
  return {
    props: {
      mdxSource,
      seo: getSanitisedResponse<AboutpageSeo>(seo),
    },
  };
};
