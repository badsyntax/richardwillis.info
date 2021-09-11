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
 * @interface NewGlobal
 */
export interface NewGlobal {
    /**
     * 
     * @type {string}
     * @memberof NewGlobal
     */
    siteName: string;
    /**
     * 
     * @type {AboutpageSeo}
     * @memberof NewGlobal
     */
    defaultSeo: AboutpageSeo;
    /**
     * 
     * @type {string}
     * @memberof NewGlobal
     */
    createdBy?: string;
    /**
     * 
     * @type {string}
     * @memberof NewGlobal
     */
    updatedBy?: string;
}

export function NewGlobalFromJSON(json: any): NewGlobal {
    return NewGlobalFromJSONTyped(json, false);
}

export function NewGlobalFromJSONTyped(json: any, ignoreDiscriminator: boolean): NewGlobal {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'siteName': json['siteName'],
        'defaultSeo': AboutpageSeoFromJSON(json['defaultSeo']),
        'createdBy': !exists(json, 'created_by') ? undefined : json['created_by'],
        'updatedBy': !exists(json, 'updated_by') ? undefined : json['updated_by'],
    };
}

export function NewGlobalToJSON(value?: NewGlobal | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'siteName': value.siteName,
        'defaultSeo': AboutpageSeoToJSON(value.defaultSeo),
        'created_by': value.createdBy,
        'updated_by': value.updatedBy,
    };
}


