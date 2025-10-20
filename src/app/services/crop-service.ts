import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private apiUrl = `${environment.apiUrl}/api/crops`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  obtenerCultivos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  registrarCultivo(cultivo: { name: string; tipo: string; ubicacion: string; etapa: string; startdate: Date }): Observable<any> {
    return this.http.post(this.apiUrl, cultivo, { headers: this.getAuthHeaders() });
  }

  eliminarCultivo(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
}

  actualizarCultivo(id: number, datos: any) {
  return this.http.put(`${this.apiUrl}/${id}`, datos, { headers: this.getAuthHeaders() });
}
}
