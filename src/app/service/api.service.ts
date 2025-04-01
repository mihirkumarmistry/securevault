import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginReq, LoginResp, OtpReq, OtpResp, RegisterReq, RegisterResp, UserRole } from '@model/auth.model';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';
import { UserResp, UserRoleReq } from '@model/user.model';
import { FileShare, UserFile } from '@model/file.model';
import { AuditLogs } from '@model/audit.model';
import { Dashboard } from '@model/dashboard.model';

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
    SharedFiles: `${this.ApiUrl}/file/files/shared`,
    FileBin: `${this.ApiUrl}/file/files/bin`,
    FileUpload: `${this.ApiUrl}/file/upload`,
    DeletFile: `${this.ApiUrl}/file/upload/`,
    
    // Audit
    Audit: `${this.ApiUrl}/auditlogs`,

    // Dashboard
    Dashboard: `${this.ApiUrl}/user/dashboard`,

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
    return this.http.delete<any>(`${this.WebAPIs.FileBin}/${file_link}`);
  }
  public getBinFiles(): Observable<Array<UserFile>> {
    return this.http.get<Array<UserFile>>(this.WebAPIs.FileBin);
  }
  public deleteBinFile(file_link: string): Observable<any> {
    return this.http.delete<any>(`${this.WebAPIs.FileUpload}/${file_link}`);
  }
  public getAllSharedFile(): Observable<Array<UserFile>> {
    return this.http.get<Array<UserFile>>(this.WebAPIs.SharedFiles);
  }
  public postFileShare(data: FileShare): Observable<any> {
    return this.http.post<any>(this.WebAPIs.SharedFiles, data);
  }
  public deleteSharedFile(id: number): Observable<any> {
    return this.http.delete<any>(`${this.WebAPIs.SharedFiles}/${id}`);
  }

  // Audit Logs
  public getAuditLogs(): Observable<AuditLogs[]> {
    return this.http.get<AuditLogs[]>(this.WebAPIs.Audit);
  }
  
  // Dashboard
  public getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(this.WebAPIs.Dashboard);
  }

}
