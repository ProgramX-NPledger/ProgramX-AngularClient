import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {GetHealthCheckServiceResponse} from '../../models/get-health-check-service-response';
import {GetApplicationsForHealthCheckResponse} from '../models/get-applications-for-health-check-response';
import {Application} from '../../core/models/application';
import {GetApplicationsResponse} from '../../core/models/get-applications-response';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApplicationsHealthCheckService {
  private baseUrl = environment.baseUrl;
  private httpClient: HttpClient = inject(HttpClient)

  readonly healthCheckItems$: Observable<GetApplicationsForHealthCheckResponse> = this.getAllApplicationsForHealthCheck();

  getAllApplicationsForHealthCheck(): Observable<GetApplicationsForHealthCheckResponse> {

    const url = `${this.baseUrl}/applications/health${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetApplicationsForHealthCheckResponse>(url);
  }



  getHealthOfApplication(applicationName: string): Observable<GetHealthCheckServiceResponse> {
    const url = `${this.baseUrl}/applications/${applicationName}/health${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetHealthCheckServiceResponse>(url);
  }
}

