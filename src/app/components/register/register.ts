import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceTs } from '../../services/auth.service.ts';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  usuario = '';
  distrito = '';
  message = '';
  submitted = false;

  distritos = [
    'Ancon', 'Ate', 'Barranco', 'Breña', 'Carabayllo', 'Chaclacayo', 'Chorrillos', 'Cieneguilla',
    'Comas', 'El Agustino', 'Independencia', 'Jesús María', 'La Molina', 'La Victoria', 'Lima',
    'Lince', 'Los Olivos', 'Lurigancho', 'Lurín', 'Magdalena del Mar', 'Miraflores', 'Pachacamac',
    'Pucusana', 'Pueblo Libre', 'Puente Piedra', 'Punta Hermosa', 'Punta Negra', 'Rímac',
    'San Bartolo', 'San Borja', 'San Isidro', 'San Juan de Lurigancho', 'San Juan de Miraflores',
    'San Luis', 'San Martín de Porres', 'San Miguel', 'Santa Anita', 'Santa María del Mar',
    'Santa Rosa', 'Santiago de Surco', 'Surquillo', 'Villa El Salvador', 'Villa María del Triunfo'
  ];

  constructor(private authService: AuthServiceTs, private router: Router) {}

  isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  register(form: NgForm) {
    this.submitted = true;

    if (!this.nombre || !this.usuario || !this.isValidEmail(this.email) || !this.isValidPassword(this.password) || !this.distrito) {
      this.message = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const userData = {
      nombre: this.nombre,
      usuario: this.usuario,
      email: this.email,
      password: this.password,
      distrito: this.distrito,
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        console.log('Registro correcto:', res);
        this.message = 'Usuario registrado correctamente';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.message = err.error?.message || 'Error al registrar usuario';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
