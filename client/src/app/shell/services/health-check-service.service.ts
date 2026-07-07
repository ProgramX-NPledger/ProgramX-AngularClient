import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {GetHealthCheckServiceResponse} from '../../models/get-health-check-service-response';
import {GetHealthCheckResponse} from '../models/get-health-check-response';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private baseUrl = environment.baseUrl;
  private healthCheckUrl: string = `${this.baseUrl}/healthcheck${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
  private httpClient: HttpClient = inject(HttpClient)

  readonly healthCheckItems$: Observable<GetHealthCheckResponse> = this.discoverHealthCheck();

  private discoverHealthCheck(): Observable<GetHealthCheckResponse> {
      return this.httpClient.get<GetHealthCheckResponse>(this.healthCheckUrl);
  }

  getHealthOfService(serviceName: string): Observable<GetHealthCheckServiceResponse> {
    const url = `${this.baseUrl}/healthcheck/${serviceName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetHealthCheckServiceResponse>(url);
  }
}

