import { apiClient } from '../api/apiClient';
import type { Aboutpage } from '../api/strapi';

export async function getAboutPage(): Promise<Aboutpage> {
  return await apiClient.aboutpageApi.aboutpageGet({});
}
