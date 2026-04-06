import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {GetHealthCheckServiceResponse} from '../model/get-health-check-service-response';
import {environment} from '../../environments/environment';
import {GetApplicationsForHealthCheckResponse} from '../model/get-applications-for-health-check-response';
import { catchError, Observable, of } from 'rxjs';
import {GetHealthCheckResponse} from '../model/get-health-check-response';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsHealthCheckServiceService {
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
