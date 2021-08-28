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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Project
 */
export interface Project {
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    description: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    tags: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    repoUrl: string;
    /**
     * 
     * @type {Date}
     * @memberof Project
     */
    publishedAt?: Date;
}

export function ProjectFromJSON(json: any): Project {
    return ProjectFromJSONTyped(json, false);
}

export function ProjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): Project {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
        'description': json['description'],
        'tags': json['tags'],
        'repoUrl': json['repoUrl'],
        'publishedAt': !exists(json, 'published_at') ? undefined : (new Date(json['published_at'])),
    };
}

export function ProjectToJSON(value?: Project | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'title': value.title,
        'description': value.description,
        'tags': value.tags,
        'repoUrl': value.repoUrl,
        'published_at': value.publishedAt === undefined ? undefined : (value.publishedAt.toISOString()),
    };
}

