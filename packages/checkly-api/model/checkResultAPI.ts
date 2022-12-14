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
import { Request } from './request';
import { Response } from './response';

/**
* The response data for an API check.
*/
export class CheckResultAPI {
    /**
    * List of API check assertions.
    */
    'assertions'?: Array<string>;
    'request'?: Request;
    'response'?: Response;
    /**
    * Describes if an error occured on the request.
    */
    'requestError'?: string;
    'jobLog'?: object;
    /**
    * Assets generated from the check run.
    */
    'jobAssets'?: Array<string>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "assertions",
            "baseName": "assertions",
            "type": "Array<string>"
        },
        {
            "name": "request",
            "baseName": "request",
            "type": "Request"
        },
        {
            "name": "response",
            "baseName": "response",
            "type": "Response"
        },
        {
            "name": "requestError",
            "baseName": "requestError",
            "type": "string"
        },
        {
            "name": "jobLog",
            "baseName": "jobLog",
            "type": "object"
        },
        {
            "name": "jobAssets",
            "baseName": "jobAssets",
            "type": "Array<string>"
        }    ];

    static getAttributeTypeMap() {
        return CheckResultAPI.attributeTypeMap;
    }
}

