import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private tokenEp = environment.host + '/oidc/v1/token';

  constructor(protected http: HttpClient) { }

  private tokenAuthHeader(): HttpHeaders {
    const base64Credentials = btoa(`${environment.username}:${environment.password}`);
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${base64Credentials}`
    });
  }

  generateToken(): Observable<any> {
    const headers = this.tokenAuthHeader();
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('scope', 'all-apis');
;    return this.http.post(this.tokenEp, body.toString(), { headers });
  }

  storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

}
