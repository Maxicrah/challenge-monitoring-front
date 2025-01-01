import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { LoginRequest } from './login.request';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<string> = new BehaviorSubject<string>("");
  
  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const token = sessionStorage.getItem("token");
      this.currentUserLoginOn = new BehaviorSubject<boolean>(token !== null);
      this.currentUserData = new BehaviorSubject<string>(token || "");
    }
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${environment.urlHost}/auth/login`, credentials).pipe(
      tap((userData) => {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          sessionStorage.setItem("token", userData.token);
          this.currentUserData.next(userData.token);
          this.currentUserLoginOn.next(true);
        }
      }),
      map((userData) => userData.token)
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.removeItem("token");
    }
    this.currentUserLoginOn.next(false);
    this.currentUserData.next("");
  }

  get userData(): Observable<string> {
    return this.currentUserData.asObservable();
  }

  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }
  get userToken():String{
    return this.currentUserData.value;
  }


  
}
