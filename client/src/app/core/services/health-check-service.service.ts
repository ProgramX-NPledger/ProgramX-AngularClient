import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { HealthCheck } from '../../model/health-check';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private httpClient: HttpClient = inject(HttpClient)
  
  baseUrl = environment.baseUrl;

  getHealth(): Observable<HealthCheck> {
    const url = `${this.baseUrl}/healthcheck`;

    return this.httpClient.get<HealthCheck>(url).pipe(
      catchError(error => of({
        status: error.message,
        azureFunctions: false,
        azureCosmosDb: false,
        azureStorage: false
      } as HealthCheck))
    );

   }

}
