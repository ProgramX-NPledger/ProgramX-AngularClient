import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable  } from 'rxjs';
import {environment} from '../../../environments/environment';
import {GetApplicationsForHealthCheckResponse} from '../../model/get-applications-for-health-check-response';
import {GetHealthCheckServiceResponse} from '../../model/get-health-check-service-response';


@Injectable({
  providedIn: 'root'
})
export class ApplicationsHealthCheckService {
  private baseUrl = environment.baseUrl;
  private httpClient: HttpClient = inject(HttpClient)

  readonly healthCheckItems$: Observable<GetApplicationsForHealthCheckResponse> = this.getAllApplicationsForHealthCheck();

  getAllApplicationsForHealthCheck(): Observable<GetApplicationsForHealthCheckResponse> {
    const url = `${this.baseUrl}/application/health${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetApplicationsForHealthCheckResponse>(url);
  }
  getHealthOfApplication(applicationName: string): Observable<GetHealthCheckServiceResponse> {
    const url = `${this.baseUrl}/application/${applicationName}/health${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetHealthCheckServiceResponse>(url);
  }
}
