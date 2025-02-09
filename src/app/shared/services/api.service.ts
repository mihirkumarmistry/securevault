import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Auth, AuthResp } from '../../core/model/auth.model';
import { ApiResponse } from '../../core/model/api.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly ApiUrl = `${environment.apiUrl}api`;
  constructor(private http: HttpClient) { }

  readonly WebAPIs = {
    Auth: `${this.ApiUrl}/Auth`
  }

  // All API endpoints will be here
  public postAuth(data: Auth): Observable<ApiResponse<AuthResp>> {
    return this.http.post<ApiResponse<AuthResp>>(this.WebAPIs.Auth, data);
  }
}
