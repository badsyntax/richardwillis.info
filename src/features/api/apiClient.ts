import fetch from 'node-fetch';
import {
  AboutpageSeo,
  ArticleApi,
  Configuration,
  ConfigurationParameters,
  ProjectApi,
  ProjectspageApi,
} from './strapi';
import { AboutpageApi } from './strapi/apis/AboutpageApi';

const configParams: ConfigurationParameters = {
  basePath: process.env.STRAPI_ENDPOINT,
  middleware: [],
  fetchApi: fetch as unknown as WindowOrWorkerGlobalScope['fetch'],
};

const apiConfig = new Configuration(configParams);

export const apiClient = {
  articleApi: new ArticleApi(apiConfig),
  projectApi: new ProjectApi(apiConfig),
  aboutpageApi: new AboutpageApi(apiConfig),
  projectspageApi: new ProjectspageApi(apiConfig),
};

export type ApiClient = typeof apiClient;

export function getSanitisedResponse<T>(o?: T): T {
  return JSON.parse(JSON.stringify(o));
}
