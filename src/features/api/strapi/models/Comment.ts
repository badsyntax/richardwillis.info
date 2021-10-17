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
 * @interface Comment
 */
export interface Comment {
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    author?: string;
    /**
     * 
     * @type {string}
     * @memberof Comment
     */
    body?: string;
    /**
     * 
     * @type {object}
     * @memberof Comment
     */
    article?: object;
    /**
     * 
     * @type {Date}
     * @memberof Comment
     */
    publishedAt?: Date;
}

export function CommentFromJSON(json: any): Comment {
    return CommentFromJSONTyped(json, false);
}

export function CommentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Comment {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'author': !exists(json, 'author') ? undefined : json['author'],
        'body': !exists(json, 'body') ? undefined : json['body'],
        'article': !exists(json, 'article') ? undefined : json['article'],
        'publishedAt': !exists(json, 'published_at') ? undefined : (new Date(json['published_at'])),
    };
}

export function CommentToJSON(value?: Comment | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'author': value.author,
        'body': value.body,
        'article': value.article,
        'published_at': value.publishedAt === undefined ? undefined : (value.publishedAt.toISOString()),
    };
}


