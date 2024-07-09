import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  public endpoint = 'Clients';
  public usersEndpoint = 'Users';

  constructor(private http: HttpClient) { }

  getClients(pageNumber: number, pageSize: number, searchTermName: string = '', searchTermMatricule: string = '', searchTermCode: string = ''): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/${this.endpoint}/get-clients`, {
      params: {
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
        searchTermName,
        searchTermMatricule,
        searchTermCode
      }
    });
  }

  uploadClient(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      // HttpClient sets the Content-Type header automatically for FormData
    });

    const uploadSubject = new Subject<any>();

    this.http.post<any>(`${environment.apiURL}/${this.endpoint}/upload`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        uploadSubject.next({
          loaded: event.loaded,
          total: event.total
        });
      } else if (event.type === HttpEventType.Response) {
        uploadSubject.next(event.body);
        uploadSubject.complete();
      }
    }, error => {
      uploadSubject.error(error);
    });

    return uploadSubject.asObservable();
  }

  consumeCode(clientName: string): Observable<any> {
    const requestBody = { clientName };

    return this.http.post<any>(`${environment.apiURL}/${this.endpoint}/consume-code`, requestBody);
  }

  getUploadedFiles(searchTermFileName: string = ''): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/${this.endpoint}/uploaded-files`, {
      params: {
        searchTermFileName
      }
    });
  }


  getUsers(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/${this.usersEndpoint}/get-users`);
  }
}
