import {HttpClient, HttpParams} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {catchError, Observable, of, throwError} from 'rxjs';
import {GetUsersCriteria} from '../models/get-users-criteria';
import {Paging} from '../../../models/paging';
import {PagedData} from '../../../core/models/paged-data';
import {SecureUser} from '../models/secure-user';
import {GetUserResponse} from '../models/get-user-response';
import {CreateUserRequest} from '../models/create-user-request';
import {CreateUserResponse} from '../models/create-user-response';
import {UpdateUserRequest} from '../models/update-user-request';
import {UpdateResponse} from '../../../core/models/update-response';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

   private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;

  getUsers(criteria: Partial<GetUsersCriteria> | null, page: Paging | null): Observable<PagedData<SecureUser>> {
    const url = `${this.baseUrl}/users`;
    let params = new HttpParams();

    // Add criteria parameters
    if (criteria) {
      if (criteria.containingText) {
        params = params.set('containsText', criteria.containingText);
      }
      if (criteria.hasRole) {
        params = params.set('withRoles', criteria.hasRole);
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

    return this.httpClient.get<PagedData<SecureUser>>(url, { params }).pipe(
      catchError(error => throwError(()=>error))
    );

  }

  getUser(userId: string): Observable<GetUserResponse | null> {
    const url = `${this.baseUrl}/users/${userId}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetUserResponse | null>(url).pipe(
      catchError(error =>
      {
        if (error.status === 404) {
          return of(null)
        }
        return of({} as GetUserResponse);
      }
    ));
  }

  createUser(createUserRequest: CreateUserRequest): Observable<CreateUserResponse> {
    const url = `${this.baseUrl}/users${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.post<CreateUserResponse>(url, createUserRequest).pipe(
      catchError(error => {
          return of({
            errorMessage: error.error,
            isOk: false
          } as unknown as CreateUserResponse)
        }
      ))
  }

  updateUser(userName: string, updateUserRequest: UpdateUserRequest): Observable<UpdateResponse> {
    const url = `${this.baseUrl}/users/${userName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.put<UpdateResponse>(url, updateUserRequest);
  }


  deleteUser(id: string) {
    const url = `${this.baseUrl}/users/${id}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.delete(url);
  }
}

