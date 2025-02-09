// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiResponse, ApiStatus } from '../model/api.model';
import { Auth, AuthResp } from '../model/auth.model';
import { ApiService } from '../../shared/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user: AuthResp;
  public _loginSubject = new Subject<boolean>();
  constructor(private apiService: ApiService, private router: Router) { }

  getUserType(): string {
    return localStorage.getItem('userType') || 'Guest';
  }

  getUserName(): string {
    const user = JSON.parse(localStorage.getItem('user'))
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  login(data: Auth): void {
    this.apiService.postAuth(data).subscribe((resp: ApiResponse<AuthResp>) => {
      if (resp.status == ApiStatus.Success) {
        this.user = resp.data;
        localStorage.setItem('authToken', this.user.accessToken);
        localStorage.setItem('userType', this.user.userType.name);
        localStorage.setItem('user', JSON.stringify(this.user));
        if (this.user.userTypeId == 1) {
          this.router.navigate(['dashboard']);
        } else {
          this.router.navigate(['appointment']);
        }

        this._loginSubject.next(true);
      } else {
        // Show toaster error
      }
    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
