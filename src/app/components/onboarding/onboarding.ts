import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-onboarding',
  imports: [ CommonModule, MatButtonModule ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css'
})
export class Onboarding {

   constructor(private router: Router) {}

  start() {
    this.router.navigate(['/login']);
  }

}
