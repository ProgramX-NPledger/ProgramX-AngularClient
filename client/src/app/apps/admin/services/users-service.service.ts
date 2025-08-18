import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { UsersResponse } from '../model/users-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
   private httpClient: HttpClient = inject(HttpClient)
  
  baseUrl = environment.baseUrl;

   
  getUsers(): Observable<UsersResponse> {
    const url = `${this.baseUrl}/user`;
    return this.httpClient.get<UsersResponse>(url).pipe(
      catchError(error => of({
        isLastPage: true,
        itemsPerPage: 0,
        items: [],
        continuationToken: undefined
      } as UsersResponse))
    );

  }

}

