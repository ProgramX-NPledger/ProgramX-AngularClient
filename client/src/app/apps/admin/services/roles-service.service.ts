import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError, Observable, of, throwError} from 'rxjs';
import {CreateRoleRequest} from '../model/create-role-request';
import {CreateRoleResponse} from '../model/create-role-response';
import {Paging} from '../../../model/paging';
import {PagedData} from '../../../model/paged-data';
import {Role} from '../model/role';
import {UpdateResponse} from '../model/update-response';
import {GetRolesCriteria} from '../model/get-roles-criteria';
import {GetRoleResponse} from '../model/get-role-response';
import {UpdateRoleRequest} from '../model/update-role-request';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = environment.baseUrl;

  getRoles(criteria: Partial<GetRolesCriteria> | null, page: Paging | null): Observable<PagedData<Role>> {
    const url = `${this.baseUrl}/role`;

    let params = new HttpParams();

    // Add criteria parameters
    if (criteria) {
      if (criteria.containingText) {
        params = params.set('containingText', criteria.containingText);
      }
      if (criteria.usedInApplications) {
        params = params.set('usedInApplications', criteria.usedInApplications);
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

    return this.httpClient.get<PagedData<Role>>(url, { params }).pipe(
      catchError(error => throwError(()=>error))
    );

  }


  getRole(roleName: string): Observable<GetRoleResponse | null> {
    const url = `${this.baseUrl}/role/${roleName}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetRoleResponse | null>(url).pipe(
      catchError(error =>
        {
          if (error.status === 404) {
            return of(null)
          }
          return of({} as GetRoleResponse);
        }
      ));
  }

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


  updateRole(updateRoleRequest: UpdateRoleRequest): Observable<UpdateResponse> {
    const url = `${this.baseUrl}/user/${updateRoleRequest.name}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.put<UpdateResponse>(url, updateRoleRequest).pipe(
      catchError(error => {
          return of({
            errorMessage: error.error,
            isOk: false
          } as UpdateResponse)
        }
      ))
  }


  deleteRole(name: string) {
    const url = `${this.baseUrl}/role/${name}${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
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
