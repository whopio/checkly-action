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
import { ReportingAggregate } from './reportingAggregate';

export class Reporting {
    /**
    * Check name.
    */
    'name': string;
    /**
    * Check ID.
    */
    'checkId': string;
    /**
    * Check type.
    */
    'checkType': string;
    /**
    * Check deactivated.
    */
    'deactivated': boolean = false;
    /**
    * Check tags.
    */
    'tags': Array<string>;
    'aggregate'?: ReportingAggregate;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "checkId",
            "baseName": "checkId",
            "type": "string"
        },
        {
            "name": "checkType",
            "baseName": "checkType",
            "type": "string"
        },
        {
            "name": "deactivated",
            "baseName": "deactivated",
            "type": "boolean"
        },
        {
            "name": "tags",
            "baseName": "tags",
            "type": "Array<string>"
        },
        {
            "name": "aggregate",
            "baseName": "aggregate",
            "type": "ReportingAggregate"
        }    ];

    static getAttributeTypeMap() {
        return Reporting.attributeTypeMap;
    }
}

