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

export class NotFoundError {
    'statusCode': NotFoundError.StatusCodeEnum;
    'error': NotFoundError.ErrorEnum;
    'message'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "statusCode",
            "baseName": "statusCode",
            "type": "NotFoundError.StatusCodeEnum"
        },
        {
            "name": "error",
            "baseName": "error",
            "type": "NotFoundError.ErrorEnum"
        },
        {
            "name": "message",
            "baseName": "message",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return NotFoundError.attributeTypeMap;
    }
}

export namespace NotFoundError {
    export enum StatusCodeEnum {
        NUMBER_404 = <any> 404
    }
    export enum ErrorEnum {
        NotFound = <any> 'Not Found'
    }
}
