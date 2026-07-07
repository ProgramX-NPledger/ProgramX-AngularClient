import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of, tap, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {Application} from '../models/application';
import {GetApplicationsResponse} from '../models/get-applications-response';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private httpClient: HttpClient = inject(HttpClient)
  baseUrl = environment.baseUrl;

  getApplicationsForRoles(memberOfRoles: string[]): Observable<Application[]> {
    let url = `${this.baseUrl}/applications${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    if (memberOfRoles && memberOfRoles.length > 0) {
      if (url.includes('?')) url += '&'; else url += '?';
      url += `supportsRoles=${memberOfRoles.join(',')}`;
    }
    return this.httpClient.get<GetApplicationsResponse>(url)
      .pipe(
        map(getApplicationsResponse => {
          return getApplicationsResponse.applications;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

}
