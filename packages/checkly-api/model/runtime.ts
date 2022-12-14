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
import { RuntimeDependencies } from './runtimeDependencies';

export class Runtime {
    /**
    * The unique name of this runtime.
    */
    'name': string;
    /**
    * Current life stage of a runtime.
    */
    'stage'?: Runtime.StageEnum;
    /**
    * Date which a runtime will be removed from our platform.
    */
    'runtimeEndOfLife'?: string;
    /**
    * Indicates if this is the current default runtime provided by Checkly.
    */
    '_default': boolean;
    /**
    * A short, human readable description of the main updates in this runtime.
    */
    'description'?: string;
    'dependencies': RuntimeDependencies;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "stage",
            "baseName": "stage",
            "type": "Runtime.StageEnum"
        },
        {
            "name": "runtimeEndOfLife",
            "baseName": "runtimeEndOfLife",
            "type": "string"
        },
        {
            "name": "_default",
            "baseName": "default",
            "type": "boolean"
        },
        {
            "name": "description",
            "baseName": "description",
            "type": "string"
        },
        {
            "name": "dependencies",
            "baseName": "dependencies",
            "type": "RuntimeDependencies"
        }    ];

    static getAttributeTypeMap() {
        return Runtime.attributeTypeMap;
    }
}

export namespace Runtime {
    export enum StageEnum {
        Beta = <any> 'BETA',
        Current = <any> 'CURRENT',
        Deprecated = <any> 'DEPRECATED',
        Removed = <any> 'REMOVED',
        Stable = <any> 'STABLE'
    }
}
