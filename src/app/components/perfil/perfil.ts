
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 
import { ReactiveFormsModule } from '@angular/forms'; 

interface UserData {
  nombre: string;
  distrito: string;
}

@Component({
  selector: 'app-perfil',
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule ], 
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  standalone: true, 
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class Perfil implements OnInit {
  
  user: UserData = { nombre: '', distrito: '' };
  editMode = false;
  
  
  distritosLima = [
    'Ancon', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla',
    'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lima',
    'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac',
    'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac',
    'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores',
    'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar',
    'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
  ];

  nombreInvalido = false;
  distritoInvalido = false;

  constructor(private http: HttpClient, private router:Router) {}
  
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
    this.nombreInvalido = false;
    this.distritoInvalido = false;
  }

  cancelEdit(): void {
    this.editMode = false;
    
    this.getProfile();
  }

  saveChanges(): void {
    
    this.nombreInvalido = !this.user.nombre || this.user.nombre.trim() === '';
    this.distritoInvalido = !this.user.distrito || this.user.distrito.trim() === '';

    if (this.nombreInvalido || this.distritoInvalido) {
      
      return; 
    }
    
    
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

  logout(): void {
    localStorage.removeItem('token');
    
    this.router.navigate(['/login']);
  }
  goToCultivos() {
    this.router.navigate(['/cultivos']);
  }
  goToAsistente() {
    this.router.navigate(['/chat']);
  }
  
  goToInicio(): void {
    this.router.navigate(['/home']); 
  }
}