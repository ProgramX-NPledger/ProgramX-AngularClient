import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private httpClient: HttpClient = inject(HttpClient)

  baseUrl = 'http://localhost:7276/api/v1';

  login(username: string, password: string) {
    const url = `${this.baseUrl}/login`;
    const body = { 
      userName: username, 
      password 
    };
    return this.httpClient.post(url, body);
  }
}
