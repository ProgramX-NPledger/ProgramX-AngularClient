import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, of, throwError} from 'rxjs';
import {GetScoutingScoresResponse} from '../models/get-scouting-scores-response';
import {CreateScoutingScoreItemRequest} from '../models/create-scouting-score-item-request';
import {CreateScoutingScoreItemResponse} from '../models/create-scouting-score-item-response';
import {Paging} from '../../../models/paging';
import {GetScoutingScoresCriteria} from '../models/get-scouting-scores-criteria';
import {PagedData} from '../../../core/models/paged-data';
import {ScoutingScoreItem} from '../models/scouting-score-item';

@Injectable({
  providedIn: 'root'
})
export class ScoutingService {
  private httpClient: HttpClient = inject(HttpClient)
  baseUrl = environment.baseUrl;

  getScoutingScores(): Observable<GetScoutingScoresResponse> {
    let url = `${this.baseUrl}/scouts/scores${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetScoutingScoresResponse>(url);
  }

  getScoutingScoreLedgerItems(criteria: Partial<GetScoutingScoresCriteria> | null, page: Paging | null): Observable<PagedData<ScoutingScoreItem>> {
    const url = `${this.baseUrl}/scouts/scoresledger`;
    let params = new HttpParams();

    // Add criteria parameters
    if (criteria) {
      if (criteria.fromDate) {
        params = params.set('onOrAfter', criteria.fromDate);
      }
      if (criteria.toDate) {
        params = params.set('onOrBefore', criteria.toDate);
      }
      // if (criteria.scoreId) {
      //   params = params.set('scoreName', criteria.scoreId);
      // }
      // if (criteria.osmScoutId) {
      //   params = params.set('osmScoutid', criteria.osmScoutId);
      // }
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

    return this.httpClient.get<PagedData<ScoutingScoreItem>>(url, { params }).pipe(
      catchError(error => throwError(()=>error))
    );


    // let url = `${this.baseUrl}/scouts/scoreledger${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    // return this.httpClient.get<GetScoutingScoresResponse>(url);
  }

  createScoutingScoreItem(createScoutingServiceRequest: CreateScoutingScoreItemRequest): Observable<CreateScoutingScoreItemResponse> {
    const url = `${this.baseUrl}/scouts/scores${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.post<CreateScoutingScoreItemResponse>(url, createScoutingServiceRequest).pipe(
      catchError(error => {
          return of({
            errorMessage: error.error,
            isOk: false
          } as unknown as CreateScoutingScoreItemResponse)
        }
      ))
  }
}
