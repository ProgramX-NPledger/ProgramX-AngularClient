import {HealthCheckItemResult} from './health-check-item-result';

export interface ApplicationHealthCheckService {
  name: string,
  url: string,
  friendlyName: string
}
