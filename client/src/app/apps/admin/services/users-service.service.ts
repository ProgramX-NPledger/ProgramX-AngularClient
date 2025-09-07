import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, Observable, of } from 'rxjs';
import { UsersResponse } from '../model/users-response';
import { UserResponse } from '../model/user-response';
import { GetUserResponse } from '../model/get-user-response';
import { UpdateUserRequest } from '../model/update-user-request';
import { UpdateResponse } from '../model/update-response';
import { UpdateProfilePhotoResponse } from '../model/update-profile-photo-response';

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

