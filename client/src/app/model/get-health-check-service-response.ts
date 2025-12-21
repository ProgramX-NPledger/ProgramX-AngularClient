import {HealthCheckItemResult} from './health-check-item-result';

export interface GetHealthCheckServiceResponse {
name: string;
timeStamp: Date;
isHealthy: boolean;
message: string | null;
subItems: HealthCheckItemResult[]
}
