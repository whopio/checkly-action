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

/**
* An object with all dependency package names and versions as in a standard package.json.
*/
export class RuntimeDependencies {
    'string'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "string",
            "baseName": "string",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return RuntimeDependencies.attributeTypeMap;
    }
}

