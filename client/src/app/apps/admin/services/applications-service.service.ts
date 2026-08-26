import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {GetApplicationsCriteria} from '../models/get-applications-criteria';
import {Paging} from '../../../models/paging';
import {GetApplicationsHealthResponse} from '../models/get-applications-health-response';
import {GetApplicationResponse} from '../models/get-application-response';
import {UpdateApplicationRequest} from '../models/update-application-request';
import {GetApplicationsResponse} from '../../../core/models/get-applications-response';

@Injectable({
  providedIn: 'root'
})

export class ApplicationsService {

  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;


  getApplications(criteria: Partial<GetApplicationsCriteria> | null, page: Paging | null): Observable<GetApplicationsResponse> {
    const url = `${this.baseUrl}/applications`;

    let params = new HttpParams();

    // Add criteria parameters
    if (criteria) {
      if (criteria.containingText) {
        params = params.set('containingText', criteria.containingText);
      }
      if (criteria.withinRoles) {
        params = params.set('withinRoles', criteria.withinRoles);
      }
    }

    // Add paging parameters
    if (page) {
      if (page.offset) {
        params = params.set('offset', page.offset.toString());
      }
      if (page.itemsPerPage) {
        params = params.set('itemsPerPage', page.itemsPerPage.toString());
      }
    }

    return this.httpClient.get<GetApplicationsResponse>(url, { params }).pipe(
      catchError(error => throwError(()=>error))
    );

  }

  getApplicationsHealth(): Observable<GetApplicationsHealthResponse> {
    const url = `${this.baseUrl}/applications/health`;
    return this.httpClient.get<GetApplicationsHealthResponse>(url).pipe(
      catchError(error => throwError(()=>error))
    );
  }


  getApplication(applicationName: string): Observable<GetApplicationResponse | null> {
    const url = `${this.baseUrl}/applications/${applicationName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetApplicationResponse | null>(url).pipe(
      catchError(error =>
        {
          if (error.status === 404) {
            return of(null)
          }
          return of({} as GetApplicationResponse);
        }
      ));
  }



}
