import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReq, LoginResp, OtpReq, OtpResp, RegisterReq, RegisterResp, UserRole } from '@model/auth.model';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';
import { UserResp, UserRoleReq } from '@model/user.model';
import { UserFile } from '@model/file.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly ApiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  readonly WebAPIs = {
    // Authentication and MFA
    Otp: `${this.ApiUrl}/user/otp/generate/`,
    Login: `${this.ApiUrl}/user/login/`,

    // Register User
    Register: `${this.ApiUrl}/user/create/`,

    // User
    User: `${this.ApiUrl}/user/`,
    UserRole: `${this.ApiUrl}/user/roles/`,
    AllUser: `${this.ApiUrl}/user/all`,

    // File
    GetAllFiles: `${this.ApiUrl}/file/files`,
    GetAllSharedFiles: `${this.ApiUrl}/file/files/shared`,
    FileUpload: `${this.ApiUrl}/file/upload`,
    DeletFile: `${this.ApiUrl}/file/upload/` // /file/upload/{file_name}
  }

  // Authentication and MFA
  public postOtp(data: OtpReq): Observable<OtpResp> {
    return this.http.post<OtpResp>(this.WebAPIs.Otp, data);
  }

  public postLogin(data: LoginReq): Observable<LoginResp> {
    return this.http.post<LoginResp>(this.WebAPIs.Login, data);
  }

  // Register User
  public postRegisterUser(data: RegisterReq): Observable<RegisterResp> {
    return this.http.post<RegisterReq>(this.WebAPIs.Register, data);
  }
  
  // Users
  public getUserRoles(): Observable<Array<UserRole>> {
    return this.http.get<Array<UserRole>>(this.WebAPIs.UserRole);
  }
  public getAllUser(): Observable<Array<UserResp>> {
    return this.http.get<Array<UserResp>>(this.WebAPIs.AllUser);
  }
  public putUserRole(data: UserRoleReq): Observable<any> {
    return this.http.put<any>(this.WebAPIs.User, data);
  }
  
  // File 
  public postFileUpload(data: FormData): Observable<any> {
    return this.http.post<any>(this.WebAPIs.FileUpload, data);
  }
  public getAllFile(): Observable<Array<UserFile>> {
    return this.http.get<Array<UserFile>>(this.WebAPIs.GetAllFiles);
  }
  public downloadFile(file_link: string): Observable<Blob> {
    return this.http.get<Blob>(`${this.WebAPIs.FileUpload}/${file_link}`, { responseType: 'blob' as 'json' });
  }
  public deleteFile(file_link: string): Observable<any> {
    return this.http.delete<any>(`${this.WebAPIs.FileUpload}/${file_link}`);
  }
}
