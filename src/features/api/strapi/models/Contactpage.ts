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
 * @interface Contactpage
 */
export interface Contactpage {
    /**
     * 
     * @type {string}
     * @memberof Contactpage
     */
    id: string;
    /**
     * 
     * @type {AboutpageSeo}
     * @memberof Contactpage
     */
    seo?: AboutpageSeo;
    /**
     * 
     * @type {string}
     * @memberof Contactpage
     */
    body?: string;
    /**
     * 
     * @type {Date}
     * @memberof Contactpage
     */
    publishedAt?: Date;
}

export function ContactpageFromJSON(json: any): Contactpage {
    return ContactpageFromJSONTyped(json, false);
}

export function ContactpageFromJSONTyped(json: any, ignoreDiscriminator: boolean): Contactpage {
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

export function ContactpageToJSON(value?: Contactpage | null): any {
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


