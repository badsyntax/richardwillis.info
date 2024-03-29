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
 * @interface Aboutpage
 */
export interface Aboutpage {
    /**
     * 
     * @type {string}
     * @memberof Aboutpage
     */
    id: string;
    /**
     * 
     * @type {AboutpageSeo}
     * @memberof Aboutpage
     */
    seo?: AboutpageSeo;
    /**
     * 
     * @type {string}
     * @memberof Aboutpage
     */
    body?: string;
    /**
     * 
     * @type {Date}
     * @memberof Aboutpage
     */
    publishedAt?: Date;
}

export function AboutpageFromJSON(json: any): Aboutpage {
    return AboutpageFromJSONTyped(json, false);
}

export function AboutpageFromJSONTyped(json: any, ignoreDiscriminator: boolean): Aboutpage {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'seo': !exists(json, 'seo') ? undefined : AboutpageSeoFromJSON(json['seo']),
        'body': !exists(json, 'body') ? undefined : json['body'],
        'publishedAt': !exists(json, 'published_at') ? undefined : (new Date(json['published_at'])),
    };
}

export function AboutpageToJSON(value?: Aboutpage | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'seo': AboutpageSeoToJSON(value.seo),
        'body': value.body,
        'published_at': value.publishedAt === undefined ? undefined : (value.publishedAt.toISOString()),
    };
}


