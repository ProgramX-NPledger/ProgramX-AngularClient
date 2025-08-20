import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../../model/user';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private httpClient: HttpClient = inject(HttpClient)
  currentUser = signal<User | null>(null);
  
  baseUrl = environment.baseUrl;

  login(username: string, password: string) {
    const url = `${this.baseUrl}/login${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    console.log(url);
    const body = { 
      userName: username, 
      password 
    };
    return this.httpClient.post<User>(url, body)
      .pipe(
        tap(user => {
          if (user) {
            this.currentUser.set(user);
          }
          else {
            this.currentUser.set(null);
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
    );

  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }


}
