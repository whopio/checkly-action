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

export class CheckAlertChannelSubscription {
    'alertChannelId': number;
    'activated': boolean = true;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "alertChannelId",
            "baseName": "alertChannelId",
            "type": "number"
        },
        {
            "name": "activated",
            "baseName": "activated",
            "type": "boolean"
        }    ];

    static getAttributeTypeMap() {
        return CheckAlertChannelSubscription.attributeTypeMap;
    }
}
