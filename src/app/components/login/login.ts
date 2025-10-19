import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthServiceTs } from '../../services/auth.service.ts';

@Component({
  selector: 'app-login',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  usuario = '';
  password = '';
  message = '';

  constructor(private AuthService: AuthServiceTs, private router: Router) {}

  login() {
    const userData = {usuario: this.usuario, password: this.password };

    this.AuthService.login(userData).subscribe({
      next: (res) => {
        console.log('Login correcto:', res);
        this.message = 'Inicio de sesión exitoso';
        localStorage.setItem('token', res.token);
        setTimeout(() => {
          this.router.navigate(['/chat']);
        }, 1000);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.message = err.error?.message || 'Error en las credenciales';
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

}
