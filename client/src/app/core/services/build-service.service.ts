import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {GetServerBuildInformationResponse} from '../models/get-server-build-information-response';

@Injectable({
  providedIn: 'root'
})
export class BuildService {
  private baseUrl = environment.baseUrl;
  private httpClient: HttpClient = inject(HttpClient)

  getServerBuildInformation(): Observable<GetServerBuildInformationResponse> {
    const url = `${this.baseUrl}/build${environment.azureFunctionsKey ? `?code=${environment.azureFunctionsKey}` : ''}`;
    return this.httpClient.get<GetServerBuildInformationResponse>(url);
  }
}
