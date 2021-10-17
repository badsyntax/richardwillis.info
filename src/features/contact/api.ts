import { apiClient } from '../api/apiClient';
import { Contactpage } from '../api/strapi/models/Contactpage';

export async function getContactPage(): Promise<Contactpage> {
  return await apiClient.contactPageApi.contactpageGet({});
}
