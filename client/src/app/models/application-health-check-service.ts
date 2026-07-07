export interface ApplicationHealthCheckService {
  name: string,
  url: string,
  friendlyName: string,
  isLoaded: boolean,
  messages: string[];
}
