import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('FrontEndAppAU');
  constructor() {
    console.log('AppComponent inicializado correctamente');
  }
}