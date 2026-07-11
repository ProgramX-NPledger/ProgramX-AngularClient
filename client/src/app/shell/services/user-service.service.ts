import {inject, Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {UpdateUserRequest} from '../models/update-user-request';
import {UpdateUserResponse} from '../models/update-user-response';
import {GetUserResponse} from '../../apps/admin/models/get-user-response';


@Injectable({
  providedIn: 'root'
})

/**
 * Provides user-related services, specific to the logged in user.
 * eg. for profile settings, etc.
 */
export class UserService {
  private baseUrl = environment.baseUrl;
  private httpClient: HttpClient = inject(HttpClient)

  updateUser(userName: string, updateUserRequest: UpdateUserRequest): Observable<UpdateUserResponse> {
    const url = `${this.baseUrl}/users/${userName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.put<UpdateUserResponse>(url, updateUserRequest);
  }

  /**
   * Get a User
   *
   * @param userId
   */
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

  // updateUserProfilePhoto(userName: string, photoFile: File): Observable<UpdateProfilePhotoResponse> {
  //   const url = `${this.baseUrl}/users/${userName}/photo${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
  //   const formData = new FormData();
  //   formData.append('photo', photoFile);
  //   return this.httpClient.put<UpdateProfilePhotoResponse>(url, formData);
  // }
  //
  //
  // removeUserProfilePhoto(userName: string): Observable<UpdateResponse> {
  //   const url = `${this.baseUrl}/users/${userName}/photo${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
  //
  //   return this.httpClient.delete<UpdateResponse>(url);
  // }

  // updateSettings(updateUserRequest: UpdateUserRequest): Observable<UpdateResponse> {
  //   const url = `${this.baseUrl}/users/${updateUserRequest.userName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
  //   return this.httpClient.put<UpdateResponse>(url, updateUserRequest);
  // }
}
