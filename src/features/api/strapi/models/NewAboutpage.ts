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
import {
    AboutpageSeo,
    AboutpageSeoFromJSON,
    AboutpageSeoFromJSONTyped,
    AboutpageSeoToJSON,
} from './';

/**
 * 
 * @export
 * @interface NewAboutpage
 */
export interface NewAboutpage {
    /**
     * 
     * @type {AboutpageSeo}
     * @memberof NewAboutpage
     */
    seo?: AboutpageSeo;
    /**
     * 
     * @type {string}
     * @memberof NewAboutpage
     */
    body?: string;
    /**
     * 
     * @type {Date}
     * @memberof NewAboutpage
     */
    publishedAt?: Date;
    /**
     * 
     * @type {string}
     * @memberof NewAboutpage
     */
    createdBy?: string;
    /**
     * 
     * @type {string}
     * @memberof NewAboutpage
     */
    updatedBy?: string;
}

export function NewAboutpageFromJSON(json: any): NewAboutpage {
    return NewAboutpageFromJSONTyped(json, false);
}

export function NewAboutpageFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewAboutpage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'seo': !exists(json, 'seo') ? undefined : AboutpageSeoFromJSON(json['seo']),
        'body': !exists(json, 'body') ? undefined : json['body'],
        'publishedAt': !exists(json, 'published_at') ? undefined : (new Date(json['published_at'])),
        'createdBy': !exists(json, 'created_by') ? undefined : json['created_by'],
        'updatedBy': !exists(json, 'updated_by') ? undefined : json['updated_by'],
    };
}

export function NewAboutpageToJSON(value?: NewAboutpage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'seo': AboutpageSeoToJSON(value.seo),
        'body': value.body,
        'published_at': value.publishedAt === undefined ? undefined : (value.publishedAt.toISOString()),
        'created_by': value.createdBy,
        'updated_by': value.updatedBy,
    };
}

