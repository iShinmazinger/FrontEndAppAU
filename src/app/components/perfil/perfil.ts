import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  user: any = {};
  editMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.get(`${environment.apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (data: any) => this.user = data.user,
        error: (err) => console.error('Error al obtener perfil:', err)
      });
    }
  }

  enableEdit(): void {
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.getProfile();
  }

  saveChanges(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.put(`${environment.apiUrl}/api/auth/update`, {
        nombre: this.user.nombre,
        distrito: this.user.distrito
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res: any) => {
          console.log('Perfil actualizado:', res);
          this.editMode = false;
          this.getProfile();
        },
        error: (err) => console.error('Error al actualizar perfil:', err)
      });
    }
  }
  goToChat() {
    window.location.href = '/chat'
  }
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
