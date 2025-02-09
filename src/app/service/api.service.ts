import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment.prod';
import { ApiResponse } from '@core/model/api.model';
import { Auth, AuthResp } from '@model/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly ApiUrl = `${environment.apiUrl}api`;
  constructor(private http: HttpClient) { }

  readonly WebAPIs = {
    Auth: `${this.ApiUrl}/Auth`,
  }

  // Auth API
  public postAuth(data: Auth): Observable<ApiResponse<AuthResp>> {
    return this.http.post<ApiResponse<AuthResp>>(this.WebAPIs.Auth, data);
  }
}
