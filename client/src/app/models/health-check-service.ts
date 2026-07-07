import {HealthCheckItemResponse} from './health-check-item-response';

export interface HealthCheckService {
  name: string,
  friendlyName: string,
  imageUrl: string | null,
  url: string
}
