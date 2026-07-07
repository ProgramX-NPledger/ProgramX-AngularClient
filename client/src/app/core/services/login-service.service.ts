import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {catchError, Observable, tap, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import {LoginResponse} from '../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private httpClient: HttpClient = inject(HttpClient)
  currentUser = signal<LoginResponse | null>(null);


  baseUrl = environment.baseUrl;

  login(username: string, password: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/login${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    const body = {
      userName: username,
      password
    };
    return this.httpClient.post<LoginResponse>(url, body)
      .pipe(
        tap(loginResponse => {
          if (loginResponse) {
            this.currentUser.set(loginResponse);
          }
          else {
            this.currentUser.set(null);
          }
          localStorage.setItem('currentUser', JSON.stringify(loginResponse));
        }),
        catchError((error) => {
          this.currentUser.set(null);
          return throwError(() => error);
        })
    );

  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }


}
