import localVarRequest from 'request';

export * from './alertChanelSubscription';
export * from './alertChannel';
export * from './alertChannelCreate';
export * from './alertChannelSubscriptionCreate';
export * from './alertSettingsReminders';
export * from './alertSettingsRunBasedEscalation';
export * from './alertSettingsSSLCertificates';
export * from './alertSettingsTimeBasedEscalation';
export * from './assertion';
export * from './basicAuth';
export * from './check';
export * from './checkAPI';
export * from './checkAPICreate';
export * from './checkAPIUpdate';
export * from './checkAlert';
export * from './checkAlertChannelSubscription';
export * from './checkAlertChannels';
export * from './checkAlertEmail';
export * from './checkAlertSMS';
export * from './checkAlertSettings';
export * from './checkAlertSlack';
export * from './checkAlertWebhook';
export * from './checkAssignment';
export * from './checkBrowser';
export * from './checkBrowserCreate';
export * from './checkBrowserUpdate';
export * from './checkCreate';
export * from './checkGroup';
export * from './checkGroupAPICheckDefaults';
export * from './checkGroupAlertSettings';
export * from './checkGroupCheck';
export * from './checkGroupCreate';
export * from './checkGroupCreateAPICheckDefaults';
export * from './checkGroupTrigger';
export * from './checkGroupUpdate';
export * from './checkResult';
export * from './checkResultAPI';
export * from './checkResultBrowser';
export * from './checkStatus';
export * from './checkTrigger';
export * from './checkUpdate';
export * from './commonPrivateLocationSchemaResponse';
export * from './conflictError';
export * from './dashboard';
export * from './dashboardCreate';
export * from './environmentVariable';
export * from './environmentVariableUpdate';
export * from './forbiddenError';
export * from './groupAssignment';
export * from './keyValue';
export * from './location';
export * from './maintenanceWindow';
export * from './maintenanceWindowCreate';
export * from './model1';
export * from './model16';
export * from './model20';
export * from './notFoundError';
export * from './paymentRequiredError';
export * from './privateLocationCreate';
export * from './privateLocationKeys';
export * from './privateLocationUpdate';
export * from './privateLocationsMetricsHistoryResponseSchema';
export * from './privateLocationsSchema';
export * from './reporting';
export * from './reportingAggregate';
export * from './request';
export * from './response';
export * from './runtime';
export * from './runtimeDependencies';
export * from './snippet';
export * from './snippetCreate';
export * from './tooManyRequestsError';
export * from './unauthorizedError';

import * as fs from 'fs';

export interface RequestDetailedFile {
    value: Buffer;
    options?: {
        filename?: string;
        contentType?: string;
    }
}

export type RequestFile = string | Buffer | fs.ReadStream | RequestDetailedFile;


import { AlertChanelSubscription } from './alertChanelSubscription';
import { AlertChannel } from './alertChannel';
import { AlertChannelCreate } from './alertChannelCreate';
import { AlertChannelSubscriptionCreate } from './alertChannelSubscriptionCreate';
import { AlertSettingsReminders } from './alertSettingsReminders';
import { AlertSettingsRunBasedEscalation } from './alertSettingsRunBasedEscalation';
import { AlertSettingsSSLCertificates } from './alertSettingsSSLCertificates';
import { AlertSettingsTimeBasedEscalation } from './alertSettingsTimeBasedEscalation';
import { Assertion } from './assertion';
import { BasicAuth } from './basicAuth';
import { Check } from './check';
import { CheckAPI } from './checkAPI';
import { CheckAPICreate } from './checkAPICreate';
import { CheckAPIUpdate } from './checkAPIUpdate';
import { CheckAlert } from './checkAlert';
import { CheckAlertChannelSubscription } from './checkAlertChannelSubscription';
import { CheckAlertChannels } from './checkAlertChannels';
import { CheckAlertEmail } from './checkAlertEmail';
import { CheckAlertSMS } from './checkAlertSMS';
import { CheckAlertSettings } from './checkAlertSettings';
import { CheckAlertSlack } from './checkAlertSlack';
import { CheckAlertWebhook } from './checkAlertWebhook';
import { CheckAssignment } from './checkAssignment';
import { CheckBrowser } from './checkBrowser';
import { CheckBrowserCreate } from './checkBrowserCreate';
import { CheckBrowserUpdate } from './checkBrowserUpdate';
import { CheckCreate } from './checkCreate';
import { CheckGroup } from './checkGroup';
import { CheckGroupAPICheckDefaults } from './checkGroupAPICheckDefaults';
import { CheckGroupAlertSettings } from './checkGroupAlertSettings';
import { CheckGroupCheck } from './checkGroupCheck';
import { CheckGroupCreate } from './checkGroupCreate';
import { CheckGroupCreateAPICheckDefaults } from './checkGroupCreateAPICheckDefaults';
import { CheckGroupTrigger } from './checkGroupTrigger';
import { CheckGroupUpdate } from './checkGroupUpdate';
import { CheckResult } from './checkResult';
import { CheckResultAPI } from './checkResultAPI';
import { CheckResultBrowser } from './checkResultBrowser';
import { CheckStatus } from './checkStatus';
import { CheckTrigger } from './checkTrigger';
import { CheckUpdate } from './checkUpdate';
import { CommonPrivateLocationSchemaResponse } from './commonPrivateLocationSchemaResponse';
import { ConflictError } from './conflictError';
import { Dashboard } from './dashboard';
import { DashboardCreate } from './dashboardCreate';
import { EnvironmentVariable } from './environmentVariable';
import { EnvironmentVariableUpdate } from './environmentVariableUpdate';
import { ForbiddenError } from './forbiddenError';
import { GroupAssignment } from './groupAssignment';
import { KeyValue } from './keyValue';
import { Location } from './location';
import { MaintenanceWindow } from './maintenanceWindow';
import { MaintenanceWindowCreate } from './maintenanceWindowCreate';
import { Model1 } from './model1';
import { Model16 } from './model16';
import { Model20 } from './model20';
import { NotFoundError } from './notFoundError';
import { PaymentRequiredError } from './paymentRequiredError';
import { PrivateLocationCreate } from './privateLocationCreate';
import { PrivateLocationKeys } from './privateLocationKeys';
import { PrivateLocationUpdate } from './privateLocationUpdate';
import { PrivateLocationsMetricsHistoryResponseSchema } from './privateLocationsMetricsHistoryResponseSchema';
import { PrivateLocationsSchema } from './privateLocationsSchema';
import { Reporting } from './reporting';
import { ReportingAggregate } from './reportingAggregate';
import { Request } from './request';
import { Response } from './response';
import { Runtime } from './runtime';
import { RuntimeDependencies } from './runtimeDependencies';
import { Snippet } from './snippet';
import { SnippetCreate } from './snippetCreate';
import { TooManyRequestsError } from './tooManyRequestsError';
import { UnauthorizedError } from './unauthorizedError';

/* tslint:disable:no-unused-variable */
let primitives = [
                    "string",
                    "boolean",
                    "double",
                    "integer",
                    "long",
                    "float",
                    "number",
                    "any"
                 ];

let enumsMap: {[index: string]: any} = {
        "AlertChannelCreate.TypeEnum": AlertChannelCreate.TypeEnum,
        "AlertSettingsReminders.AmountEnum": AlertSettingsReminders.AmountEnum,
        "AlertSettingsReminders.IntervalEnum": AlertSettingsReminders.IntervalEnum,
        "AlertSettingsRunBasedEscalation.FailedRunThresholdEnum": AlertSettingsRunBasedEscalation.FailedRunThresholdEnum,
        "AlertSettingsTimeBasedEscalation.MinutesFailingThresholdEnum": AlertSettingsTimeBasedEscalation.MinutesFailingThresholdEnum,
        "Assertion.SourceEnum": Assertion.SourceEnum,
        "Assertion.ComparisonEnum": Assertion.ComparisonEnum,
        "Check.LocationsEnum": Check.LocationsEnum,
        "Check.RuntimeIdEnum": Check.RuntimeIdEnum,
        "Check.CheckTypeEnum": Check.CheckTypeEnum,
        "CheckAPI.LocationsEnum": CheckAPI.LocationsEnum,
        "CheckAPI.RuntimeIdEnum": CheckAPI.RuntimeIdEnum,
        "CheckAPI.FrequencyEnum": CheckAPI.FrequencyEnum,
        "CheckAPI.CheckTypeEnum": CheckAPI.CheckTypeEnum,
        "CheckAPICreate.LocationsEnum": CheckAPICreate.LocationsEnum,
        "CheckAPICreate.RuntimeIdEnum": CheckAPICreate.RuntimeIdEnum,
        "CheckAPICreate.FrequencyEnum": CheckAPICreate.FrequencyEnum,
        "CheckAPIUpdate.LocationsEnum": CheckAPIUpdate.LocationsEnum,
        "CheckAPIUpdate.RuntimeIdEnum": CheckAPIUpdate.RuntimeIdEnum,
        "CheckAPIUpdate.FrequencyEnum": CheckAPIUpdate.FrequencyEnum,
        "CheckAlert.CheckTypeEnum": CheckAlert.CheckTypeEnum,
        "CheckAlertSettings.EscalationTypeEnum": CheckAlertSettings.EscalationTypeEnum,
        "CheckAlertWebhook.MethodEnum": CheckAlertWebhook.MethodEnum,
        "CheckBrowser.LocationsEnum": CheckBrowser.LocationsEnum,
        "CheckBrowser.RuntimeIdEnum": CheckBrowser.RuntimeIdEnum,
        "CheckBrowser.CheckTypeEnum": CheckBrowser.CheckTypeEnum,
        "CheckBrowser.FrequencyEnum": CheckBrowser.FrequencyEnum,
        "CheckBrowserCreate.LocationsEnum": CheckBrowserCreate.LocationsEnum,
        "CheckBrowserCreate.RuntimeIdEnum": CheckBrowserCreate.RuntimeIdEnum,
        "CheckBrowserCreate.FrequencyEnum": CheckBrowserCreate.FrequencyEnum,
        "CheckBrowserUpdate.LocationsEnum": CheckBrowserUpdate.LocationsEnum,
        "CheckBrowserUpdate.RuntimeIdEnum": CheckBrowserUpdate.RuntimeIdEnum,
        "CheckBrowserUpdate.FrequencyEnum": CheckBrowserUpdate.FrequencyEnum,
        "CheckCreate.LocationsEnum": CheckCreate.LocationsEnum,
        "CheckCreate.RuntimeIdEnum": CheckCreate.RuntimeIdEnum,
        "CheckCreate.CheckTypeEnum": CheckCreate.CheckTypeEnum,
        "CheckGroup.LocationsEnum": CheckGroup.LocationsEnum,
        "CheckGroup.RuntimeIdEnum": CheckGroup.RuntimeIdEnum,
        "CheckGroupAlertSettings.EscalationTypeEnum": CheckGroupAlertSettings.EscalationTypeEnum,
        "CheckGroupCheck.LocationsEnum": CheckGroupCheck.LocationsEnum,
        "CheckGroupCheck.RuntimeIdEnum": CheckGroupCheck.RuntimeIdEnum,
        "CheckGroupCheck.CheckTypeEnum": CheckGroupCheck.CheckTypeEnum,
        "CheckGroupCreate.LocationsEnum": CheckGroupCreate.LocationsEnum,
        "CheckGroupCreate.RuntimeIdEnum": CheckGroupCreate.RuntimeIdEnum,
        "CheckGroupUpdate.LocationsEnum": CheckGroupUpdate.LocationsEnum,
        "CheckGroupUpdate.RuntimeIdEnum": CheckGroupUpdate.RuntimeIdEnum,
        "CheckUpdate.LocationsEnum": CheckUpdate.LocationsEnum,
        "CheckUpdate.RuntimeIdEnum": CheckUpdate.RuntimeIdEnum,
        "CheckUpdate.CheckTypeEnum": CheckUpdate.CheckTypeEnum,
        "ConflictError.StatusCodeEnum": ConflictError.StatusCodeEnum,
        "ConflictError.ErrorEnum": ConflictError.ErrorEnum,
        "Dashboard.WidthEnum": Dashboard.WidthEnum,
        "Dashboard.RefreshRateEnum": Dashboard.RefreshRateEnum,
        "Dashboard.PaginationRateEnum": Dashboard.PaginationRateEnum,
        "DashboardCreate.WidthEnum": DashboardCreate.WidthEnum,
        "DashboardCreate.RefreshRateEnum": DashboardCreate.RefreshRateEnum,
        "DashboardCreate.PaginationRateEnum": DashboardCreate.PaginationRateEnum,
        "ForbiddenError.StatusCodeEnum": ForbiddenError.StatusCodeEnum,
        "ForbiddenError.ErrorEnum": ForbiddenError.ErrorEnum,
        "Model16.MethodEnum": Model16.MethodEnum,
        "Model16.BodyTypeEnum": Model16.BodyTypeEnum,
        "Model20.MethodEnum": Model20.MethodEnum,
        "Model20.BodyTypeEnum": Model20.BodyTypeEnum,
        "NotFoundError.StatusCodeEnum": NotFoundError.StatusCodeEnum,
        "NotFoundError.ErrorEnum": NotFoundError.ErrorEnum,
        "PaymentRequiredError.StatusCodeEnum": PaymentRequiredError.StatusCodeEnum,
        "PaymentRequiredError.ErrorEnum": PaymentRequiredError.ErrorEnum,
        "Request.MethodEnum": Request.MethodEnum,
        "Request.BodyTypeEnum": Request.BodyTypeEnum,
        "Runtime.StageEnum": Runtime.StageEnum,
        "TooManyRequestsError.StatusCodeEnum": TooManyRequestsError.StatusCodeEnum,
        "TooManyRequestsError.ErrorEnum": TooManyRequestsError.ErrorEnum,
        "UnauthorizedError.StatusCodeEnum": UnauthorizedError.StatusCodeEnum,
        "UnauthorizedError.ErrorEnum": UnauthorizedError.ErrorEnum,
}

let typeMap: {[index: string]: any} = {
    "AlertChanelSubscription": AlertChanelSubscription,
    "AlertChannel": AlertChannel,
    "AlertChannelCreate": AlertChannelCreate,
    "AlertChannelSubscriptionCreate": AlertChannelSubscriptionCreate,
    "AlertSettingsReminders": AlertSettingsReminders,
    "AlertSettingsRunBasedEscalation": AlertSettingsRunBasedEscalation,
    "AlertSettingsSSLCertificates": AlertSettingsSSLCertificates,
    "AlertSettingsTimeBasedEscalation": AlertSettingsTimeBasedEscalation,
    "Assertion": Assertion,
    "BasicAuth": BasicAuth,
    "Check": Check,
    "CheckAPI": CheckAPI,
    "CheckAPICreate": CheckAPICreate,
    "CheckAPIUpdate": CheckAPIUpdate,
    "CheckAlert": CheckAlert,
    "CheckAlertChannelSubscription": CheckAlertChannelSubscription,
    "CheckAlertChannels": CheckAlertChannels,
    "CheckAlertEmail": CheckAlertEmail,
    "CheckAlertSMS": CheckAlertSMS,
    "CheckAlertSettings": CheckAlertSettings,
    "CheckAlertSlack": CheckAlertSlack,
    "CheckAlertWebhook": CheckAlertWebhook,
    "CheckAssignment": CheckAssignment,
    "CheckBrowser": CheckBrowser,
    "CheckBrowserCreate": CheckBrowserCreate,
    "CheckBrowserUpdate": CheckBrowserUpdate,
    "CheckCreate": CheckCreate,
    "CheckGroup": CheckGroup,
    "CheckGroupAPICheckDefaults": CheckGroupAPICheckDefaults,
    "CheckGroupAlertSettings": CheckGroupAlertSettings,
    "CheckGroupCheck": CheckGroupCheck,
    "CheckGroupCreate": CheckGroupCreate,
    "CheckGroupCreateAPICheckDefaults": CheckGroupCreateAPICheckDefaults,
    "CheckGroupTrigger": CheckGroupTrigger,
    "CheckGroupUpdate": CheckGroupUpdate,
    "CheckResult": CheckResult,
    "CheckResultAPI": CheckResultAPI,
    "CheckResultBrowser": CheckResultBrowser,
    "CheckStatus": CheckStatus,
    "CheckTrigger": CheckTrigger,
    "CheckUpdate": CheckUpdate,
    "CommonPrivateLocationSchemaResponse": CommonPrivateLocationSchemaResponse,
    "ConflictError": ConflictError,
    "Dashboard": Dashboard,
    "DashboardCreate": DashboardCreate,
    "EnvironmentVariable": EnvironmentVariable,
    "EnvironmentVariableUpdate": EnvironmentVariableUpdate,
    "ForbiddenError": ForbiddenError,
    "GroupAssignment": GroupAssignment,
    "KeyValue": KeyValue,
    "Location": Location,
    "MaintenanceWindow": MaintenanceWindow,
    "MaintenanceWindowCreate": MaintenanceWindowCreate,
    "Model1": Model1,
    "Model16": Model16,
    "Model20": Model20,
    "NotFoundError": NotFoundError,
    "PaymentRequiredError": PaymentRequiredError,
    "PrivateLocationCreate": PrivateLocationCreate,
    "PrivateLocationKeys": PrivateLocationKeys,
    "PrivateLocationUpdate": PrivateLocationUpdate,
    "PrivateLocationsMetricsHistoryResponseSchema": PrivateLocationsMetricsHistoryResponseSchema,
    "PrivateLocationsSchema": PrivateLocationsSchema,
    "Reporting": Reporting,
    "ReportingAggregate": ReportingAggregate,
    "Request": Request,
    "Response": Response,
    "Runtime": Runtime,
    "RuntimeDependencies": RuntimeDependencies,
    "Snippet": Snippet,
    "SnippetCreate": SnippetCreate,
    "TooManyRequestsError": TooManyRequestsError,
    "UnauthorizedError": UnauthorizedError,
}

export class ObjectSerializer {
    public static findCorrectType(data: any, expectedType: string) {
        if (data == undefined) {
            return expectedType;
        } else if (primitives.indexOf(expectedType.toLowerCase()) !== -1) {
            return expectedType;
        } else if (expectedType === "Date") {
            return expectedType;
        } else {
            if (enumsMap[expectedType]) {
                return expectedType;
            }

            if (!typeMap[expectedType]) {
                return expectedType; // w/e we don't know the type
            }

            // Check the discriminator
            let discriminatorProperty = typeMap[expectedType].discriminator;
            if (discriminatorProperty == null) {
                return expectedType; // the type does not have a discriminator. use it.
            } else {
                if (data[discriminatorProperty]) {
                    var discriminatorType = data[discriminatorProperty];
                    if(typeMap[discriminatorType]){
                        return discriminatorType; // use the type given in the discriminator
                    } else {
                        return expectedType; // discriminator did not map to a type
                    }
                } else {
                    return expectedType; // discriminator was not present (or an empty string)
                }
            }
        }
    }

    public static serialize(data: any, type: string) {
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.serialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return data.toISOString();
        } else {
            if (enumsMap[type]) {
                return data;
            }
            if (!typeMap[type]) { // in case we dont know the type
                return data;
            }

            // Get the actual type of this object
            type = this.findCorrectType(data, type);

            // get the map for the correct type.
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            let instance: {[index: string]: any} = {};
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.baseName] = ObjectSerializer.serialize(data[attributeType.name], attributeType.type);
            }
            return instance;
        }
    }

    public static deserialize(data: any, type: string) {
        // polymorphism may change the actual type.
        type = ObjectSerializer.findCorrectType(data, type);
        if (data == undefined) {
            return data;
        } else if (primitives.indexOf(type.toLowerCase()) !== -1) {
            return data;
        } else if (type.lastIndexOf("Array<", 0) === 0) { // string.startsWith pre es6
            let subType: string = type.replace("Array<", ""); // Array<Type> => Type>
            subType = subType.substring(0, subType.length - 1); // Type> => Type
            let transformedData: any[] = [];
            for (let index = 0; index < data.length; index++) {
                let datum = data[index];
                transformedData.push(ObjectSerializer.deserialize(datum, subType));
            }
            return transformedData;
        } else if (type === "Date") {
            return new Date(data);
        } else {
            if (enumsMap[type]) {// is Enum
                return data;
            }

            if (!typeMap[type]) { // dont know the type
                return data;
            }
            let instance = new typeMap[type]();
            let attributeTypes = typeMap[type].getAttributeTypeMap();
            for (let index = 0; index < attributeTypes.length; index++) {
                let attributeType = attributeTypes[index];
                instance[attributeType.name] = ObjectSerializer.deserialize(data[attributeType.baseName], attributeType.type);
            }
            return instance;
        }
    }
}

export interface Authentication {
    /**
    * Apply authentication settings to header and query params.
    */
    applyToRequest(requestOptions: localVarRequest.Options): Promise<void> | void;
}

export class HttpBasicAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        requestOptions.auth = {
            username: this.username, password: this.password
        }
    }
}

export class HttpBearerAuth implements Authentication {
    public accessToken: string | (() => string) = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            const accessToken = typeof this.accessToken === 'function'
                            ? this.accessToken()
                            : this.accessToken;
            requestOptions.headers["Authorization"] = "Bearer " + accessToken;
        }
    }
}

export class ApiKeyAuth implements Authentication {
    public apiKey: string = '';

    constructor(private location: string, private paramName: string) {
    }

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (this.location == "query") {
            (<any>requestOptions.qs)[this.paramName] = this.apiKey;
        } else if (this.location == "header" && requestOptions && requestOptions.headers) {
            requestOptions.headers[this.paramName] = this.apiKey;
        } else if (this.location == 'cookie' && requestOptions && requestOptions.headers) {
            if (requestOptions.headers['Cookie']) {
                requestOptions.headers['Cookie'] += '; ' + this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
            else {
                requestOptions.headers['Cookie'] = this.paramName + '=' + encodeURIComponent(this.apiKey);
            }
        }
    }
}

export class OAuth implements Authentication {
    public accessToken: string = '';

    applyToRequest(requestOptions: localVarRequest.Options): void {
        if (requestOptions && requestOptions.headers) {
            requestOptions.headers["Authorization"] = "Bearer " + this.accessToken;
        }
    }
}

export class VoidAuth implements Authentication {
    public username: string = '';
    public password: string = '';

    applyToRequest(_: localVarRequest.Options): void {
        // Do nothing
    }
}

export type Interceptor = (requestOptions: localVarRequest.Options) => (Promise<void> | void);
