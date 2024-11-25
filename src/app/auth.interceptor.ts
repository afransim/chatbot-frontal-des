import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { environment } from '../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes(environment.host + '/oidc/v1/token')) {
        return next.handle(req);
      }
    const token = this.tokenService.getToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {'Authorization': `Bearer ${token}`}
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 403) && !req.headers.get('x-token-refreshed')) {
          // Token expired
          
          return this.tokenService.generateToken().pipe(
            switchMap((tokenResponse: any) => {
              this.tokenService.storeToken(tokenResponse.access_token);
              const newAuthReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + tokenResponse.access_token)
                .set('x-token-refreshed', 'true')
              });
              return next.handle(newAuthReq);
            }),
            catchError(err => {
              this.tokenService.clearToken();
              return throwError(() => err);
            })
          );
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
