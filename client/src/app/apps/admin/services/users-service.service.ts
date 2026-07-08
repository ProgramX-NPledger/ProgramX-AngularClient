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
import {UpdateResponse} from '../models/update-response';
import {UpdateProfilePhotoResponse} from '../models/update-profile-photo-response';

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
    const url = `${this.baseUrl}/user/${userId}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
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
    const url = `${this.baseUrl}/user${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.post<CreateUserResponse>(url, createUserRequest).pipe(
      catchError(error => {
          return of({
            errorMessage: error.error,
            isOk: false
          } as unknown as CreateUserResponse)
        }
      ))
  }

  updateUser(updateUserRequest: UpdateUserRequest): Observable<UpdateResponse> {
    const url = `${this.baseUrl}/user/${updateUserRequest.userName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.put<UpdateResponse>(url, updateUserRequest).pipe(
      catchError(error => {
        return of({
          errorMessage: error.error,
          isOk: false
        } as UpdateResponse)
      }
      ))
  }

  updateUserProfilePhoto(userName: string, photoFile: File): Observable<UpdateProfilePhotoResponse> {
    const url = `${this.baseUrl}/user/${userName}/photo${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    const formData = new FormData();
    formData.append('photo', photoFile);
    return this.httpClient.put<UpdateProfilePhotoResponse>(url, formData).pipe(
      catchError(error => {
        console.error(error);
        return of({
          errorMessage: error.error,
          isOk: false
        } as UpdateProfilePhotoResponse)
      })
    );
  }


  removeUserProfilePhoto(userName: string): Observable<UpdateResponse> {
    const url = `${this.baseUrl}/user/${userName}/photo${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;

    return this.httpClient.delete<UpdateResponse>(url).pipe(
      catchError(error => {
        console.error(error);
        return of({
          errorMessage: error.error,
          isOk: false
        } as UpdateResponse)
      })
    );
  }

  updateSettings(updateUserRequest: UpdateUserRequest): Observable<UpdateResponse> {
    const url = `${this.baseUrl}/user/${updateUserRequest.userName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.put<UpdateResponse>(url, updateUserRequest).pipe(
      catchError(error => {
        console.error(error);
        return of({
          errorMessage: error.error,
          isOk: false
        } as UpdateResponse)
      })
    );
  }

  deleteUser(id: string) {
    const url = `${this.baseUrl}/user/${id}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.delete(url).pipe(
      catchError(error => {
        throw new Error(error.error);
        console.error(error);
        return of({
          errorMessage: error.error,
          isOk: false
        })
      })
    )
  }
}

