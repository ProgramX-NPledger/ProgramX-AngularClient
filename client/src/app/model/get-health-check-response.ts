import {HealthCheckItem} from './health-check-item';

export interface GetHealthCheckResponse {
  timeStamp: Date,
  healthCheckItems: HealthCheckItem[]
  // following properties are not part of the response
  isTooManyRequests: boolean
}
