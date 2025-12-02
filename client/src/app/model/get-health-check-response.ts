import {HealthCheckItem} from './health-check-item';
import {HealthCheckService} from './health-check-service';

export interface GetHealthCheckResponse {
  timeStamp: Date,
  services: HealthCheckService[]
}
