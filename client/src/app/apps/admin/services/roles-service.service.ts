import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, of} from 'rxjs';
import {GetRolesResponse} from '../model/get-roles-response';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;



  getRoles(): Observable<GetRolesResponse> {
    const url = `${this.baseUrl}/role`;
    return this.httpClient.get<GetRolesResponse>(url).pipe(
      catchError(error => of({
        isLastPage: true,
        itemsPerPage: 0,
        items: [],
        continuationToken: undefined
      } as GetRolesResponse))
    );

  }

}
