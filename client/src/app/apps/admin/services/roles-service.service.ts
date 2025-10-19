import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, of} from 'rxjs';
import {GetRolesResponse} from '../model/get-roles-response';
import {CreateRoleRequest} from '../model/create-role-request';
import {CreateRoleResponse} from '../model/create-role-response';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;



  createRole(createRoleRequest: CreateRoleRequest): Observable<CreateRoleResponse> {
    const url = `${this.baseUrl}/role${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.post<CreateRoleResponse>(url, createRoleRequest).pipe(
      catchError(error => {
          return of({
            errorMessage: error.error,
            isOk: false
          } as unknown as CreateRoleResponse)
        }
      ))
  }


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
