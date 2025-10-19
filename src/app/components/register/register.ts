import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceTs } from '../../services/auth.service.ts';

@Component({
  selector: 'app-register',
  imports: [ CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  nombre = '';
  email = '';
  password = '';
  usuario='';
  distrito = '';
  message = '';

  constructor(private authService: AuthServiceTs, private router: Router) {}

  register() {
    const userData = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      distrito: this.distrito,
      usuario: this.usuario,
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
