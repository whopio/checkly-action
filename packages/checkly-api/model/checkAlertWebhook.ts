/**
 * Checkly Public API
 * These are the docs for the newly released Checkly Public API.<br />If you have any questions, please do not hesitate to get in touch with us.
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { RequestFile } from './models';
import { KeyValue } from './keyValue';

export class CheckAlertWebhook {
    'name'?: string = '';
    'url': string = '';
    'method'?: CheckAlertWebhook.MethodEnum = CheckAlertWebhook.MethodEnum.Post;
    'headers'?: Array<KeyValue>;
    '_queryParameters'?: Array<KeyValue>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "url",
            "baseName": "url",
            "type": "string"
        },
        {
            "name": "method",
            "baseName": "method",
            "type": "CheckAlertWebhook.MethodEnum"
        },
        {
            "name": "headers",
            "baseName": "headers",
            "type": "Array<KeyValue>"
        },
        {
            "name": "_queryParameters",
            "baseName": "queryParameters",
            "type": "Array<KeyValue>"
        }    ];

    static getAttributeTypeMap() {
        return CheckAlertWebhook.attributeTypeMap;
    }
}

export namespace CheckAlertWebhook {
    export enum MethodEnum {
        Get = <any> 'GET',
        Post = <any> 'POST',
        Put = <any> 'PUT',
        Head = <any> 'HEAD',
        Delete = <any> 'DELETE',
        Patch = <any> 'PATCH'
    }
}
