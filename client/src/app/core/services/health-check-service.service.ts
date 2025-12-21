import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import {GetHealthCheckResponse} from '../../model/get-health-check-response';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private baseUrl = environment.baseUrl;
  private healthCheckUrl: string = `${this.baseUrl}/healthcheck${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
  private httpClient: HttpClient = inject(HttpClient)

  readonly healthCheckItems$: Observable<GetHealthCheckResponse> = this.discoverHealthCheck();

  private discoverHealthCheck(): Observable<GetHealthCheckResponse> {
    console.log('discoverHealthCheck');
      return this.httpClient.get<GetHealthCheckResponse>(this.healthCheckUrl);
  }
  //
  // readonly healthCheck$ = this.httpClient.get<GetHealthCheckResponse>(this.healthCheckUrl).pipe(
  //   catchError(error => {
  //     const azureWebAppsResult = {
  //       name: 'azure-web-apps',
  //       friendlyName: 'Azure Web Apps',
  //       immediateHealthCheckResponse: {
  //         name: 'azure-web-apps',
  //         isHealthy: false,
  //         timeStamp: new Date(),
  //       }
  //     };
  //     const azureFunctionsResult = {
  //       name: 'azure-functions',
  //       friendlyName: 'Azure Functions',
  //       immediateHealthCheckResponse: {
  //         name: 'azure-functions',
  //         isHealthy: false,
  //         timeStamp: new Date()
  //       }
  //     };
  //
  //
  //     const healthCheckItems = [azureWebAppsResult, azureFunctionsResult];
  //
  //     const result = {
  //       timeStamp: new Date(),
  //       healthCheckItems: healthCheckItems,
  //       isTooManyRequests: error.status==429
  //     } as GetHealthCheckResponse
  //
  //     return of(result);
  //   }));
  //
  // getHealth(): Observable<GetHealthCheckResponse> {
  //
  //   return this.httpClient.get<GetHealthCheckResponse>(this.healthCheckUrl).pipe(
  //     catchError(error => {
  //       const azureWebAppsResult = {
  //         name: 'azure-web-apps',
  //         friendlyName: 'Azure Web Apps',
  //         immediateHealthCheckResponse: {
  //           name: 'azure-web-apps',
  //           isHealthy: false,
  //           timeStamp: new Date(),
  //         }
  //       };
  //       const azureFunctionsResult = {
  //         name: 'azure-functions',
  //         friendlyName: 'Azure Functions',
  //         immediateHealthCheckResponse: {
  //           name: 'azure-functions',
  //           isHealthy: false,
  //           timeStamp: new Date()
  //         }
  //       };
  //
  //       const healthCheckItems = [azureWebAppsResult, azureFunctionsResult];
  //
  //       const result = {
  //         timeStamp: new Date(),
  //         healthCheckItems: healthCheckItems,
  //         isTooManyRequests: error.status==429
  //       } as GetHealthCheckResponse
  //
  //       return of(result);
  //     }));
  // }


  getHealthOfService(serviceName: string): Observable<GetHealthCheckResponse> {
    const url = `${this.baseUrl}/healthcheck/${serviceName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetHealthCheckResponse>(url);
  }
}
