import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from './register.request';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }


  register(registerCredentials: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.urlHost}/auth/register`, registerCredentials);
  }

}
