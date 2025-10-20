import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CropService } from '../../services/crop-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crop',
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, RouterModule ],
  templateUrl: './crop.html',
  styleUrl: './crop.css'
})
export class Crop implements OnInit {

  newCrop = { name: '', tipo: '', ubicacion: '', etapa: '',startdate: new Date()};
  crops: any[] = [];

  constructor(private cultivoService: CropService, private router:Router) {}

  ngOnInit(): void {
    this.getCrops();
  }

  getCrops(): void {
    this.cultivoService.obtenerCultivos().subscribe({
      next: (res) => this.crops = res,
      error: (err) => console.error('Error al obtener cultivos:', err)
    });
  }

  addCrop(): void {
    if (!this.newCrop.name.trim()) return;
    this.newCrop.startdate = new Date(this.newCrop.startdate);
    this.cultivoService.registrarCultivo(this.newCrop).subscribe({
      next: () => {
        this.newCrop = { name: '', tipo: '', ubicacion: '', etapa: '',startdate: new Date() };
        this.getCrops();
      },
      error: (err) => console.error('Error al registrar cultivo:', err)
    });
  }
  enableEdit(crop: any): void {
    crop.editMode = true;
  }

  cancelEdit(crop: any): void {
    crop.editMode = false;
    this.getCrops();
  }

  saveEdit(crop: any): void {
    this.cultivoService.actualizarCultivo(crop.id, crop).subscribe({
      next: () => {
        crop.editMode = false;
        this.getCrops();
      },
      error: (err) => console.error('Error al actualizar cultivo:', err)
    });
  }

  deleteCrop(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este cultivo?')) {
      this.cultivoService.eliminarCultivo(id).subscribe({
        next: () => this.getCrops(),
        error: (err) => console.error('Error al eliminar cultivo:', err)
      });
    }
  }

  goToChat() {
    this.router.navigate(['/chat']);
  }
}
