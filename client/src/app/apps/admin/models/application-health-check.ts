import {HealthCheckItemResult} from '../../../models/health-check-item-result';


export interface ApplicationHealthCheck {
  isHealthy: boolean;
  message: string | null;
  healthCheckName: string;
  items: HealthCheckItemResult[]
}
