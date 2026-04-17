import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetUserResponse} from '../../admin/model/get-user-response';
import {environment} from '../../../../environments/environment';
import {OsmKeyInitiationResponse} from '../models/osm-key-initiation-response';
import {catchError, Observable, of, throwError} from 'rxjs';
import {GetTermsResponse} from '../models/get-terms-response';

@Injectable({
  providedIn: 'root'
})
export class OsmService {
  private httpClient: HttpClient = inject(HttpClient)
  baseUrl = environment.baseUrl;

  getTerms(): Observable<GetTermsResponse> {
    let url = `${this.baseUrl}/scouts/osm/terms${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetTermsResponse>(url);
  }

  getMembers(): Observable<string | null> {
    // build the url

    let url = `${this.baseUrl}/scouts/osm/members${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;

    return this.httpClient.get(url, {
      responseType: 'text'
    }).pipe(
      catchError(error =>
        {
          if (error.status === 404) {
            return of(null)
          }
          return of({} as string);
        }
      ));
  }

  //
  // getOsmKeyInitiation(): Observable<string | null> {
  //   // build the url
  //
  //   let url = `${this.baseUrl}/scouts/osm/initiatekeyexchange${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
  //
  //   return this.httpClient.get(url, {
  //     responseType: 'text'
  //   }).pipe(
  //     catchError(error =>
  //       {
  //         if (error.status === 404) {
  //           return of(null)
  //         }
  //         return of({} as string);
  //       }
  //     ));
  // }

}
