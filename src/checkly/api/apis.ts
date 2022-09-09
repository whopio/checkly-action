export * from './alertChannelsApi';
import { AlertChannelsApi } from './alertChannelsApi';
export * from './badgesApi';
import { BadgesApi } from './badgesApi';
export * from './checkAlertsApi';
import { CheckAlertsApi } from './checkAlertsApi';
export * from './checkGroupsApi';
import { CheckGroupsApi } from './checkGroupsApi';
export * from './checkResultsApi';
import { CheckResultsApi } from './checkResultsApi';
export * from './checkStatusApi';
import { CheckStatusApi } from './checkStatusApi';
export * from './checksApi';
import { ChecksApi } from './checksApi';
export * from './dashboardsApi';
import { DashboardsApi } from './dashboardsApi';
export * from './environmentVariablesApi';
import { EnvironmentVariablesApi } from './environmentVariablesApi';
export * from './locationApi';
import { LocationApi } from './locationApi';
export * from './maintenanceWindowsApi';
import { MaintenanceWindowsApi } from './maintenanceWindowsApi';
export * from './privateLocationsApi';
import { PrivateLocationsApi } from './privateLocationsApi';
export * from './reportingApi';
import { ReportingApi } from './reportingApi';
export * from './runtimesApi';
import { RuntimesApi } from './runtimesApi';
export * from './snippetsApi';
import { SnippetsApi } from './snippetsApi';
export * from './triggersApi';
import { TriggersApi } from './triggersApi';
import * as http from 'http';

export class HttpError extends Error {
    constructor (public response: http.IncomingMessage, public body: any, public statusCode?: number) {
        super('HTTP request failed');
        this.name = 'HttpError';
    }
}

export { RequestFile } from '../model/models';

export const APIS = [AlertChannelsApi, BadgesApi, CheckAlertsApi, CheckGroupsApi, CheckResultsApi, CheckStatusApi, ChecksApi, DashboardsApi, EnvironmentVariablesApi, LocationApi, MaintenanceWindowsApi, PrivateLocationsApi, ReportingApi, RuntimesApi, SnippetsApi, TriggersApi];
