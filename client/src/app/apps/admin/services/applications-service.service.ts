import {inject, Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {ApplicationsResponse} from '../model/applications-response';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApplicationsService {

  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;

  getApplications(): Observable<ApplicationsResponse> {
    const url = `${this.baseUrl}/application`;
    return this.httpClient.get<ApplicationsResponse>(url).pipe(
      catchError(error => of({
        isLastPage: true,
        itemsPerPage: 0,
        items: [],
        continuationToken: undefined
      } as ApplicationsResponse))
    );

  }
}
