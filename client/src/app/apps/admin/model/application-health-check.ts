import {HealthCheckItemResult} from '../../../model/health-check-item-result';


export interface ApplicationHealthCheck {
  isHealthy: boolean;
  message: string | null;
  healthCheckName: string;
  items: HealthCheckItemResult[]
}
