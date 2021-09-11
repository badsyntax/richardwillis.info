import fetch from 'node-fetch';
import {
  ArticleApi,
  Configuration,
  ConfigurationParameters,
  ProjectApi,
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
};

export type ApiClient = typeof apiClient;
