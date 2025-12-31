import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of, throwError} from 'rxjs';
import {ApplicationsResponse} from '../model/applications-response';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {GetRolesCriteria} from '../model/get-roles-criteria';
import {Paging} from '../../../model/paging';
import {PagedData} from '../../../model/paged-data';
import {Role} from '../model/role';
import {Application} from '../../../model/application';
import {GetRoleResponse} from '../model/get-role-response';
import {UpdateRoleRequest} from '../model/update-role-request';
import {UpdateResponse} from '../model/update-response';
import {GetApplicationsCriteria} from '../model/get-applications-criteria';
import {GetApplicationResponse} from '../model/get-application-response';
import {UpdateApplicationRequest} from '../model/update-application-request';
import {GetApplicationsHealthResponse} from '../model/get-applications-health-response';

@Injectable({
  providedIn: 'root'
})

export class ApplicationsService {

  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;


  getApplications(criteria: Partial<GetApplicationsCriteria> | null, page: Paging | null): Observable<PagedData<Application>> {
    const url = `${this.baseUrl}/application`;

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

    return this.httpClient.get<PagedData<Application>>(url, { params }).pipe(
      catchError(error => throwError(()=>error))
    );

  }

  getApplicationsHealth(): Observable<GetApplicationsHealthResponse> {
    const url = `${this.baseUrl}/application/health`;
    return this.httpClient.get<GetApplicationsHealthResponse>(url).pipe(
      catchError(error => throwError(()=>error))
    );
  }


  getApplication(applicationName: string): Observable<GetApplicationResponse | null> {
    const url = `${this.baseUrl}/application/${applicationName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
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

/* TODO: is this still needed? */
  updateApplication(updateApplicationRequest: UpdateApplicationRequest): Observable<UpdateResponse> {
    const url = `${this.baseUrl}/application/${updateApplicationRequest.name}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.put<UpdateResponse>(url, updateApplicationRequest).pipe(
      catchError(error => {
          return of({
            errorMessage: error.error,
            isOk: false
          } as UpdateResponse)
        }
      ))
  }


}
