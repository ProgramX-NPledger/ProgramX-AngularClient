export interface HealthCheckItemResponse {
  name: string,
  isHealthy: boolean,
  message: string | null,
  timeStamp: Date,

}
