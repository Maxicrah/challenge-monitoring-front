import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from '../../models/plant';
import { environment } from '../../environments/environment';
import { LoginService } from '../auth/login.service';
import { Alert } from '../../models/alert';

@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor(private http: HttpClient, private loginService: LoginService) { 
    
  }

  createPlant(plant: Plant): Observable<Plant> {

    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Plant>(`${environment.urlApi}plant/create`, plant, { headers });
  }

  deletePlant(id: number): Observable<string> {
    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<string>(`${environment.urlApi}plant/delete/` + id, { headers, responseType: 'text' as 'json' });
  }
  

  editPlant(id:number, alerts: Alert[]): Observable<Plant> {
    let token = this.loginService.userToken;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Plant>(`${environment.urlApi}plant/edit/` + id, alerts,  { headers });
  }

  getPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${environment.urlApi}plant/find/all`);
  }
}
