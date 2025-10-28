import { CropService } from './../../services/crop-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { environment } from '../../../environments/environment';

interface UserData {
  nombre: string;
  distrito: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home implements OnInit {
  user: UserData = { nombre: '', distrito: '' };
  cropsCrecimiento: any[] = [];

  constructor(private router: Router, private http: HttpClient, private CropService: CropService) {}

  ngOnInit(): void {
    this.getProfile();
    this.getCropsCrecimiento();
  }

  getCropsCrecimiento(): void {
    this.CropService.getCropsCrecimiento().subscribe({
      next: (res) => this.cropsCrecimiento = res,
      error: (err) => console.error('Error al obtener cultivos en crecimiento:', err)
    });
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

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  goToInicio(): void { this.router.navigate(['/home']); }
  goToCultivos(): void { this.router.navigate(['/cultivos']); }
  goToAsistente(): void { this.router.navigate(['/chat']); }
  goToPerfil(): void { this.router.navigate(['/perfil']); }
}