import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, throwError, from } from 'rxjs';
import { environment } from '../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private sendEp = environment.host + '/serving-endpoint/' + environment.endpoint_name + '/invocations';
  private uploadEp = environment.host + '/api/2.0/fs/files/Volumes/';
  private documentEp = environment.host + '/api/2.0/fs/directories/Volumes/';

  constructor(protected http: HttpClient, private tokenService: TokenService) { }

  getDocumentList(): Observable<any> {
    const token = this.tokenService.getToken();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Folder-Path': environment.document_path
    });

    return this.http.get(this.documentEp, { headers }).pipe(
      map((response: any) => {
        return response.contents;
      }),
      catchError((error) => {
        if (error.status === 403) {
          this.tokenService.clearToken();
        }
        return throwError(() => error);
      })
    );
  }

  chatbotSend(message: any, document?: string): Observable<any> {
    const token = this.tokenService.getToken();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Endpoint-Name': environment.endpoint_name
    });

    const body = {
      dataframe_split: {
        columns: ['messages', 'selected_documents'],
        data: [
          [
            message,
            document ? [document] : [],
          ],
        ],
      },
    };

    return this.http.post(this.sendEp,
       body, { headers }).pipe(
      map((response: any) => {
        return response.predictions;
      }),
      catchError((error) => {
        if (error.status === 403) {
          this.tokenService.clearToken();
        }
        return throwError(() => error);
      })
    );
  }

  uploadFile(file: ArrayBuffer, name: string): Observable<any> {
    const token = this.tokenService.getToken();

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/octet-stream',
      'Folder-Path': environment.upload_path,
      'File-Name': name
    });

    return this.http.put(this.uploadEp, file, { headers: headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error occurred during file upload:', error);
        return throwError(() => error);
      })
    );
  }

}
