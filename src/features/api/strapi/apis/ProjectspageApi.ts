/* tslint:disable */
/* eslint-disable */
/**
 * DOCUMENTATION
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: contact-email@something.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    NewProjectspage,
    NewProjectspageFromJSON,
    NewProjectspageToJSON,
    Projectspage,
    ProjectspageFromJSON,
    ProjectspageToJSON,
} from '../models';

export interface ProjectspageGetRequest {
    limit?: number;
    sort?: string;
    start?: number;
    ne?: string;
    lt?: string;
    lte?: string;
    gt?: string;
    gte?: string;
    contains?: string;
    containss?: string;
    _in?: Array<string>;
    nin?: Array<string>;
}

export interface ProjectspagePutRequest {
    newProjectspage: NewProjectspage;
}

/**
 * 
 */
export class ProjectspageApi extends runtime.BaseAPI {

    /**
     * Delete a single projectspage record
     */
    async projectspageDeleteRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<number>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/projectspage`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.TextApiResponse(response) as any;
    }

    /**
     * Delete a single projectspage record
     */
    async projectspageDelete(initOverrides?: RequestInit): Promise<number> {
        const response = await this.projectspageDeleteRaw(initOverrides);
        return await response.value();
    }

    /**
     * Find all the projectspage\'s records
     */
    async projectspageGetRaw(requestParameters: ProjectspageGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Projectspage>> {
        const queryParameters: any = {};

        if (requestParameters.limit !== undefined) {
            queryParameters['_limit'] = requestParameters.limit;
        }

        if (requestParameters.sort !== undefined) {
            queryParameters['_sort'] = requestParameters.sort;
        }

        if (requestParameters.start !== undefined) {
            queryParameters['_start'] = requestParameters.start;
        }

        if (requestParameters.ne !== undefined) {
            queryParameters['_ne'] = requestParameters.ne;
        }

        if (requestParameters.lt !== undefined) {
            queryParameters['_lt'] = requestParameters.lt;
        }

        if (requestParameters.lte !== undefined) {
            queryParameters['_lte'] = requestParameters.lte;
        }

        if (requestParameters.gt !== undefined) {
            queryParameters['_gt'] = requestParameters.gt;
        }

        if (requestParameters.gte !== undefined) {
            queryParameters['_gte'] = requestParameters.gte;
        }

        if (requestParameters.contains !== undefined) {
            queryParameters['_contains'] = requestParameters.contains;
        }

        if (requestParameters.containss !== undefined) {
            queryParameters['_containss'] = requestParameters.containss;
        }

        if (requestParameters._in) {
            queryParameters['_in'] = requestParameters._in;
        }

        if (requestParameters.nin) {
            queryParameters['_nin'] = requestParameters.nin;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/projectspage`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectspageFromJSON(jsonValue));
    }

    /**
     * Find all the projectspage\'s records
     */
    async projectspageGet(requestParameters: ProjectspageGetRequest, initOverrides?: RequestInit): Promise<Projectspage> {
        const response = await this.projectspageGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update a single projectspage record
     */
    async projectspagePutRaw(requestParameters: ProjectspagePutRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Projectspage>> {
        if (requestParameters.newProjectspage === null || requestParameters.newProjectspage === undefined) {
            throw new runtime.RequiredError('newProjectspage','Required parameter requestParameters.newProjectspage was null or undefined when calling projectspagePut.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearerAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/projectspage`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: NewProjectspageToJSON(requestParameters.newProjectspage),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ProjectspageFromJSON(jsonValue));
    }

    /**
     * Update a single projectspage record
     */
    async projectspagePut(requestParameters: ProjectspagePutRequest, initOverrides?: RequestInit): Promise<Projectspage> {
        const response = await this.projectspagePutRaw(requestParameters, initOverrides);
        return await response.value();
    }

}