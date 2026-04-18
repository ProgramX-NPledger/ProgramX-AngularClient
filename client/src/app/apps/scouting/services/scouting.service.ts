import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, of} from 'rxjs';
import {GetMembersResponse} from '../models/get-members-response';
import {GetScoutingScoresResponse} from '../models/get-scouting-scores-response';
import {CreateUserResponse} from '../../admin/model/create-user-response';
import {CreateScoutingScoreItemRequest} from '../models/create-scouting-score-item-request';
import {CreateScoutingScoreItemResponse} from '../models/create-scouting-score-item-response';

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
