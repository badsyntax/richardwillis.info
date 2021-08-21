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
 * @interface Writer
 */
export interface Writer {
    /**
     * 
     * @type {string}
     * @memberof Writer
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Writer
     */
    name?: string;
    /**
     * 
     * @type {object}
     * @memberof Writer
     */
    picture?: object;
    /**
     * 
     * @type {Array<object>}
     * @memberof Writer
     */
    articles?: Array<object>;
    /**
     * 
     * @type {string}
     * @memberof Writer
     */
    email?: string;
}

export function WriterFromJSON(json: any): Writer {
    return WriterFromJSONTyped(json, false);
}

export function WriterFromJSONTyped(json: any, ignoreDiscriminator: boolean): Writer {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'picture': !exists(json, 'picture') ? undefined : json['picture'],
        'articles': !exists(json, 'articles') ? undefined : json['articles'],
        'email': !exists(json, 'email') ? undefined : json['email'],
    };
}

export function WriterToJSON(value?: Writer | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'name': value.name,
        'picture': value.picture,
        'articles': value.articles,
        'email': value.email,
    };
}

