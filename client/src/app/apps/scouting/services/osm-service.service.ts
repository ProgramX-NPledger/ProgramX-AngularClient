import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, of, throwError} from 'rxjs';
import {GetTermsResponse} from '../models/get-terms-response';
import {GetMembersResponse} from '../models/get-members-response';

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

  getMembers(termId: number): Observable<GetMembersResponse> {
    let url = `${this.baseUrl}/scouts/osm/members?termId=${termId}${environment.azureFunctionsKey ? `&code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetMembersResponse>(url);
  }


}
