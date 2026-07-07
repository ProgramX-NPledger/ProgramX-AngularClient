import {ApplicationHealthCheck} from './application-health-check';


export interface GetApplicationsHealthResponse {
  timeStamp: Date;
  isHealthy: boolean;
  applicationHealthChecks: ApplicationHealthCheck[];
}
