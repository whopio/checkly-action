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


import localVarRequest from 'request';
import http from 'http';

/* tslint:disable:no-unused-locals */

import { ObjectSerializer, Authentication, VoidAuth, Interceptor } from '../model/models';
import { HttpBasicAuth, HttpBearerAuth, ApiKeyAuth, OAuth } from '../model/models';

import { HttpError, RequestFile } from './apis';

let defaultBasePath = 'https://api.checklyhq.com';

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum BadgesApiApiKeys {
    Bearer,
}

export class BadgesApi {
    protected _basePath = defaultBasePath;
    protected _defaultHeaders : any = {};
    protected _useQuerystring : boolean = false;

    protected authentications = {
        'default': <Authentication>new VoidAuth(),
        'Bearer': new ApiKeyAuth('header', 'Authorization'),
    }

    protected interceptors: Interceptor[] = [];

    constructor(basePath?: string);
    constructor(basePathOrUsername: string, password?: string, basePath?: string) {
        if (password) {
            if (basePath) {
                this.basePath = basePath;
            }
        } else {
            if (basePathOrUsername) {
                this.basePath = basePathOrUsername
            }
        }
    }

    set useQuerystring(value: boolean) {
        this._useQuerystring = value;
    }

    set basePath(basePath: string) {
        this._basePath = basePath;
    }

    set defaultHeaders(defaultHeaders: any) {
        this._defaultHeaders = defaultHeaders;
    }

    get defaultHeaders() {
        return this._defaultHeaders;
    }

    get basePath() {
        return this._basePath;
    }

    public setDefaultAuthentication(auth: Authentication) {
        this.authentications.default = auth;
    }

    public setApiKey(key: BadgesApiApiKeys, value: string) {
        (this.authentications as any)[BadgesApiApiKeys[key]].apiKey = value;
    }

    public addInterceptor(interceptor: Interceptor) {
        this.interceptors.push(interceptor);
    }

    /**
     * Get check status badge. You can enable the badges feature in <a href=\"https://app.checklyhq.com/settings/account/general\">account settings</a>
     * @param checkId 
     * @param style 
     * @param theme 
     * @param responseTime 
     */
    public async getV1BadgesChecksCheckid (checkId: string, style?: 'flat' | 'plastic' | 'flat-square' | 'for-the-badge' | 'social', theme?: 'light' | 'dark' | 'default', responseTime?: boolean, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: string;  }> {
        const localVarPath = this.basePath + '/v1/badges/checks/{checkId}'
            .replace('{' + 'checkId' + '}', encodeURIComponent(String(checkId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this._defaultHeaders);
        const produces = ['application/json'];
        // give precedence to 'application/json'
        if (produces.indexOf('application/json') >= 0) {
            localVarHeaderParams.Accept = 'application/json';
        } else {
            localVarHeaderParams.Accept = produces.join(',');
        }
        let localVarFormParams: any = {};

        // verify required parameter 'checkId' is not null or undefined
        if (checkId === null || checkId === undefined) {
            throw new Error('Required parameter checkId was null or undefined when calling getV1BadgesChecksCheckid.');
        }

        if (style !== undefined) {
            localVarQueryParameters['style'] = ObjectSerializer.serialize(style, "'flat' | 'plastic' | 'flat-square' | 'for-the-badge' | 'social'");
        }

        if (theme !== undefined) {
            localVarQueryParameters['theme'] = ObjectSerializer.serialize(theme, "'light' | 'dark' | 'default'");
        }

        if (responseTime !== undefined) {
            localVarQueryParameters['responseTime'] = ObjectSerializer.serialize(responseTime, "boolean");
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));

        let interceptorPromise = authenticationPromise;
        for (const interceptor of this.interceptors) {
            interceptorPromise = interceptorPromise.then(() => interceptor(localVarRequestOptions));
        }

        return interceptorPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.IncomingMessage; body: string;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "string");
                            resolve({ response: response, body: body });
                        } else {
                            reject(new HttpError(response, body, response.statusCode));
                        }
                    }
                });
            });
        });
    }
    /**
     * Get group status badge. You can enable the badges feature in <a href=\"https://app.checklyhq.com/settings/account/general\">account settings</a>
     * @param groupId 
     * @param style 
     * @param theme 
     * @param responseTime 
     */
    public async getV1BadgesGroupsGroupid (groupId: number, style?: 'flat' | 'plastic' | 'flat-square' | 'for-the-badge' | 'social', theme?: 'light' | 'dark' | 'default', responseTime?: boolean, options: {headers: {[name: string]: string}} = {headers: {}}) : Promise<{ response: http.IncomingMessage; body: string;  }> {
        const localVarPath = this.basePath + '/v1/badges/groups/{groupId}'
            .replace('{' + 'groupId' + '}', encodeURIComponent(String(groupId)));
        let localVarQueryParameters: any = {};
        let localVarHeaderParams: any = (<any>Object).assign({}, this._defaultHeaders);
        const produces = ['application/json'];
        // give precedence to 'application/json'
        if (produces.indexOf('application/json') >= 0) {
            localVarHeaderParams.Accept = 'application/json';
        } else {
            localVarHeaderParams.Accept = produces.join(',');
        }
        let localVarFormParams: any = {};

        // verify required parameter 'groupId' is not null or undefined
        if (groupId === null || groupId === undefined) {
            throw new Error('Required parameter groupId was null or undefined when calling getV1BadgesGroupsGroupid.');
        }

        if (style !== undefined) {
            localVarQueryParameters['style'] = ObjectSerializer.serialize(style, "'flat' | 'plastic' | 'flat-square' | 'for-the-badge' | 'social'");
        }

        if (theme !== undefined) {
            localVarQueryParameters['theme'] = ObjectSerializer.serialize(theme, "'light' | 'dark' | 'default'");
        }

        if (responseTime !== undefined) {
            localVarQueryParameters['responseTime'] = ObjectSerializer.serialize(responseTime, "boolean");
        }

        (<any>Object).assign(localVarHeaderParams, options.headers);

        let localVarUseFormData = false;

        let localVarRequestOptions: localVarRequest.Options = {
            method: 'GET',
            qs: localVarQueryParameters,
            headers: localVarHeaderParams,
            uri: localVarPath,
            useQuerystring: this._useQuerystring,
            json: true,
        };

        let authenticationPromise = Promise.resolve();
        authenticationPromise = authenticationPromise.then(() => this.authentications.default.applyToRequest(localVarRequestOptions));

        let interceptorPromise = authenticationPromise;
        for (const interceptor of this.interceptors) {
            interceptorPromise = interceptorPromise.then(() => interceptor(localVarRequestOptions));
        }

        return interceptorPromise.then(() => {
            if (Object.keys(localVarFormParams).length) {
                if (localVarUseFormData) {
                    (<any>localVarRequestOptions).formData = localVarFormParams;
                } else {
                    localVarRequestOptions.form = localVarFormParams;
                }
            }
            return new Promise<{ response: http.IncomingMessage; body: string;  }>((resolve, reject) => {
                localVarRequest(localVarRequestOptions, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && response.statusCode >= 200 && response.statusCode <= 299) {
                            body = ObjectSerializer.deserialize(body, "string");
                            resolve({ response: response, body: body });
                        } else {
                            reject(new HttpError(response, body, response.statusCode));
                        }
                    }
                });
            });
        });
    }
}