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

export class SnippetCreate {
    /**
    * The snippet name.
    */
    'name': string;
    /**
    * Your Node.js code that interacts with the API check lifecycle, or functions as a partial for browser checks.
    */
    'script': string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "script",
            "baseName": "script",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return SnippetCreate.attributeTypeMap;
    }
}

