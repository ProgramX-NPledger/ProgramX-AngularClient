import {ApplicationHealthCheckService} from './application-health-check-service';

export interface GetApplicationsForHealthCheckResponse {
  timeStamp: Date;
  isElevated: boolean;
  healthCheckServices:ApplicationHealthCheckService[]
}
