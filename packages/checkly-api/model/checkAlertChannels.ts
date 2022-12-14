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
import { CheckAlertEmail } from './checkAlertEmail';
import { CheckAlertSMS } from './checkAlertSMS';
import { CheckAlertSlack } from './checkAlertSlack';
import { CheckAlertWebhook } from './checkAlertWebhook';

export class CheckAlertChannels {
    'email'?: Array<CheckAlertEmail>;
    'webhook'?: Array<CheckAlertWebhook>;
    'slack'?: Array<CheckAlertSlack>;
    'sms'?: Array<CheckAlertSMS>;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "email",
            "baseName": "email",
            "type": "Array<CheckAlertEmail>"
        },
        {
            "name": "webhook",
            "baseName": "webhook",
            "type": "Array<CheckAlertWebhook>"
        },
        {
            "name": "slack",
            "baseName": "slack",
            "type": "Array<CheckAlertSlack>"
        },
        {
            "name": "sms",
            "baseName": "sms",
            "type": "Array<CheckAlertSMS>"
        }    ];

    static getAttributeTypeMap() {
        return CheckAlertChannels.attributeTypeMap;
    }
}

