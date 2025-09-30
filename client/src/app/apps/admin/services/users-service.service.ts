import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { GetUsersResponse } from '../model/get-users-response';
import { GetUserResponse } from '../model/get-user-response';
import { UpdateUserRequest } from '../model/update-user-request';
import { UpdateResponse } from '../model/update-response';
import { UpdateProfilePhotoResponse } from '../model/update-profile-photo-response';
import {CreateUserRequest} from '../model/create-user-request';
import {CreateUserResponse} from '../model/create-user-response';
import {GetUsersCriteria} from '../model/get-users-criteria';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

   private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;

  getUsers(criteria: Partial<GetUsersCriteria> | null): Observable<GetUsersResponse> {
    const url = `${this.baseUrl}/user`;
    let queryString='';
    if (criteria) {
      queryString = '?';
      if (criteria.containingText) queryString+='containingText='+encodeURIComponent(criteria.containingText)+'&';
      if (criteria.hasRole) queryString+='withRoles='+encodeURIComponent(criteria.hasRole)+'&';
      if (criteria.hasApplication) queryString+='hasAccessToApplications='+encodeURIComponent(criteria.hasApplication)+'&';
      if (criteria.continuationToken) queryString+='continuationToken='+encodeURIComponent(criteria.continuationToken)+'&';
    }
    console.log('criteria',criteria);
    return this.httpClient.get<GetUsersResponse>(`${url}${queryString}`).pipe(
      catchError(error => of({
        isLastPage: true,
        itemsPerPage: 0,
        items: [],
        continuationToken: undefined,
        estimatedTotalPageCount: 0,
        nextPageUrl: undefined,
        requestCharge: undefined
      } as GetUsersResponse))
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

}

