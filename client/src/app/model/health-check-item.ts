import {HealthCheckItemResponse} from './health-check-item-response';

export interface HealthCheckItem {
  name: string,
  friendlyName: string,
  imageUrl: string | null,
  immediateHealthCheckResponse: HealthCheckItemResponse | null
}
