import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../models/user';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  getUser(id: number): Observable<User> {
    return this.http.get<{ user: User }>(`${environment.urlApi}user/${id}`).pipe(
      map(response => response.user) 
    );
  }

 
}
