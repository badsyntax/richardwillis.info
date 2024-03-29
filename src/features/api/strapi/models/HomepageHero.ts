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
 * @interface HomepageHero
 */
export interface HomepageHero {
    /**
     * 
     * @type {string}
     * @memberof HomepageHero
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof HomepageHero
     */
    title: string;
}

export function HomepageHeroFromJSON(json: any): HomepageHero {
    return HomepageHeroFromJSONTyped(json, false);
}

export function HomepageHeroFromJSONTyped(json: any, ignoreDiscriminator: boolean): HomepageHero {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'title': json['title'],
    };
}

export function HomepageHeroToJSON(value?: HomepageHero | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'title': value.title,
    };
}


