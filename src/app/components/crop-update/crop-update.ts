import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CropUpdateService } from '../../services/crop-update-service';

@Component({
  selector: 'app-crop-update',
  imports: [ CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, RouterModule ],
  templateUrl: './crop-update.html',
  styleUrl: './crop-update.css'
})
export class CropUpdate implements OnInit {

  cropId!: number;
  newUpdate = { crop_id: '', status: '', notes: '', image_url: '', date: new Date() };
  updates: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cropUpdateService: CropUpdateService
  ) {}

  ngOnInit(): void {
    this.cropId = Number(this.route.snapshot.paramMap.get('id'));
    this.newUpdate.crop_id = this.cropId.toString();
    this.obtenerActualizaciones();
  }

  obtenerActualizaciones(): void {
    this.cropUpdateService.obtenerActualizacionesPorCultivo(this.cropId).subscribe({
      next: (res) => this.updates = res,
      error: (err) => console.error('Error al obtener actualizaciones:', err)
    });
  }

  registrarActualizacion(): void {
    if (!this.newUpdate.status.trim()) return;

    this.newUpdate.date = new Date(this.newUpdate.date);

    this.cropUpdateService.registrarActualizacion(this.newUpdate).subscribe({
      next: () => {
        this.newUpdate = { crop_id: this.cropId.toString(), status: '', notes: '', image_url: '', date: new Date() };
        this.obtenerActualizaciones();
      },
      error: (err) => console.error('Error al registrar actualización:', err)
    });
  }
  enableEdit(update: any): void {
    update.editMode = true;
  }

  cancelEdit(update: any): void {
    update.editMode = false;
    this.obtenerActualizaciones();
  }

  saveEdit(update: any): void {
    this.cropUpdateService.actualizarActualizacion(update.id, update).subscribe({
      next: () => {
        update.editMode = false;
        this.obtenerActualizaciones();
      },
      error: (err) => console.error('Error al actualizar actualización:', err)
    });
  }

  deleteUpdate(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta actualización?')) {
      this.cropUpdateService.eliminarActualizacion(id).subscribe({
        next: () => this.obtenerActualizaciones(),
        error: (err) => console.error('Error al eliminar actualización:', err)
      });
    }
  }
}
