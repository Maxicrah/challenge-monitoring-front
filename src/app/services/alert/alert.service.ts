import { Injectable } from '@angular/core';
import { LoginService } from '../auth/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private loginService : LoginService, private http : HttpClient) { }

  
  getCountHighAlerts():Observable<number>{
    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${environment.urlApi}alert/count/high`, { headers })
  }
  getCountMediumAlerts():Observable<number>{
    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${environment.urlApi}alert/count/medium`, { headers })
  }
  getCountReadingsOkAlerts():Observable<number>{
    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${environment.urlApi}alert/count/reading-ok`, { headers })
  }
  getCountSensorsDisabledAlerts():Observable<number>{
    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number>(`${environment.urlApi}alert/count/sensors-disabled`, { headers })
  }
  



}
