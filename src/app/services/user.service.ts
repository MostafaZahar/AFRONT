import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = 'Users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiURL}/${this.endpoint}/get-users`);
  }

  activateAccount(userId: string): Observable<any> {
    return this.http.patch(`${environment.apiURL}/${this.endpoint}/activer-compte`, { userId: userId }); // Assurez-vous que la clé est bien 'userId'
  }

  deactivateAccount(userId: string): Observable<any> {
    return this.http.patch(`${environment.apiURL}/${this.endpoint}/desactiver-compte`, { userId: userId }); // Assurez-vous que la clé est bien 'userId'
  }
}
