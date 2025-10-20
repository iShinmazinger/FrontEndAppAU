import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CropUpdateService {

  private apiUrl = `${environment.apiUrl}/api/crop-updates`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  obtenerActualizacionesPorCultivo(cropId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${cropId}`, {
      headers: this.getAuthHeaders()
    });
  }

  registrarActualizacion(update: any): Observable<any> {
    return this.http.post(this.apiUrl, update, {
      headers: this.getAuthHeaders()
    });
  }
  actualizarActualizacion(id: number, update: any) {
    return this.http.put(`${this.apiUrl}/${id}`, update, {
    headers: this.getAuthHeaders()
    });
  }

  eliminarActualizacion(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, {
    headers: this.getAuthHeaders()
    });
  }  
}
