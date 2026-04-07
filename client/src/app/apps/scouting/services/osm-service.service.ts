import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetUserResponse} from '../../admin/model/get-user-response';
import {environment} from '../../../../environments/environment';
import {OsmKeyInitiationResponse} from '../models/osm-key-initiation-response';
import {catchError, Observable, of, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OsmService {
  private httpClient: HttpClient = inject(HttpClient)
  baseUrl = environment.baseUrl;

  getOsmKeyInitiation(): Observable<string | null> {
    const url = `${this.baseUrl}/scouts/osm/initiatekeyexchange${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
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

}
