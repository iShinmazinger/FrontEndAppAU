import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CropService } from '../../services/crop-service'; 
import { HttpErrorResponse, HttpClientModule } from '@angular/common/http';

interface CropData {
  id: number;
  name: string;
  tipo: string;
  ubicacion: string;
  etapa: string;
  startdate: Date; 
}

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [ 
    CommonModule, 
    FormsModule, 
    RouterModule,
    HttpClientModule 
  ],
  templateUrl: './crop.html',
  styleUrl: './crop.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe] 
})
export class Crop implements OnInit {
  
  newCrop: CropData = { id: 0, name: '', tipo: '', ubicacion: '', etapa: '', startdate: new Date() };
  crops: CropData[] = [];
  showForm: 'register' | 'edit' | 'list' | 'empty' = 'empty'; 
  cropToEdit: CropData | null = null;
  
  validationError: string = ''; 

  tiposDeCultivo: string[] = [
    'Hortalizas de hoja',
    'Hortalizas de raíz',
    'Hierbas aromáticas',
    'Frutales pequeños',
    'Legumbres',
    'Tubérculos'
  ];

  ubicacionesUrbanas: string[] = [
    'Balcón/Terraza',
    'Patio/Jardín trasero',
    'Azotea',
    'Macetas pequeñas',
    'Huerto vertical interior',
    'Invernadero pequeño',
    'Recipientes reciclados'
  ];

  constructor(private cropService: CropService, private router:Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getCrops();
  }

  
  private validateCrop(crop: CropData): boolean {
    this.validationError = '';

    if (!crop.name || crop.name.trim() === '') {
      this.validationError = 'El campo Nombre del cultivo es obligatorio.';
      return false;
    }
    if (!crop.tipo || crop.tipo.trim() === '') {
      this.validationError = 'Debe seleccionar un Tipo de cultivo.';
      return false;
    }
    if (!crop.ubicacion || crop.ubicacion.trim() === '') {
      this.validationError = 'Debe seleccionar una Ubicación.';
      return false;
    }
    if (!crop.etapa || crop.etapa.trim() === '') {
      this.validationError = 'Debe seleccionar una Etapa de crecimiento.';
      return false;
    }
    if (!crop.startdate) {
      this.validationError = 'Debe seleccionar una Fecha de inicio.';
      return false;
    }
    return true;
  }

  getCrops(): void {
    this.cropService.obtenerCultivos().subscribe({
      next: (data) => {
        this.crops = data.map(crop => ({
          ...crop,
          startdate: new Date(crop.startdate) 
        }));
        this.showForm = this.crops.length > 0 ? 'list' : 'empty';
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener cultivos:', err);
        this.showForm = 'empty'; 
      }
    });
  }

  
  addCrop(): void {
    
    if (!this.validateCrop(this.newCrop)) {
      return; 
    }

    const payload = {
      name: this.newCrop.name,
      tipo: this.newCrop.tipo,
      ubicacion: this.newCrop.ubicacion,
      etapa: this.newCrop.etapa,
      startdate: this.newCrop.startdate.toISOString().split('T')[0] 
    };

    this.cropService.registrarCultivo(payload as any).subscribe({
      next: () => {
        console.log('Cultivo registrado con éxito');
        this.getCrops(); 
        this.cancelForm();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al registrar cultivo:', err);
        this.validationError = 'Error al registrar. Intente de nuevo.';
      }
    });
  }

  
  saveEdit(): void {
    if (this.cropToEdit) {
      
      if (!this.validateCrop(this.cropToEdit)) {
        return; 
      }
      
      const { id, ...payload } = this.cropToEdit;
      
      (payload as any).startdate = this.cropToEdit.startdate.toISOString().split('T')[0];

      this.cropService.actualizarCultivo(id, payload).subscribe({
        next: () => {
          console.log('Cultivo actualizado con éxito');
          this.getCrops();
          this.cancelForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar cultivo:', err);
          this.validationError = 'Error al actualizar. Intente de nuevo.';
        }
      });
    }
  }

  deleteCrop(id: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar este cultivo?')) {
      return;
    }

    this.cropService.eliminarCultivo(id).subscribe({
      next: () => {
        console.log('Cultivo eliminado con éxito');
        this.getCrops();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al eliminar cultivo:', err);
      }
    });
  }

  onDateChange(event: string | null, target: 'new' | 'edit'): void {
    const newDate = event ? new Date(event) : new Date();

    if (target === 'new') {
      this.newCrop.startdate = newDate;
    } else if (target === 'edit' && this.cropToEdit) {
      this.cropToEdit.startdate = newDate;
    }
    
    this.validationError = ''; 
  }

  startRegister(): void {
    this.newCrop = { id: 0, name: '', tipo: '', ubicacion: '', etapa: '', startdate: new Date() };
    this.validationError = ''; 
    this.showForm = 'register';
  }

  cancelForm(): void {
    this.showForm = this.crops.length > 0 ? 'list' : 'empty';
    this.cropToEdit = null;
    this.validationError = ''; 
  }

  enableEdit(crop: CropData): void {
    this.cropToEdit = {...crop}; 
    this.validationError = ''; 
    this.showForm = 'edit';
  }

  goToCultivoDiario(id: number): void {
    this.router.navigate(['/crop-updates', id]); 
  }
  
  goToInicio(): void {
    this.router.navigate(['/home']); 
  }
  goToAsistente(): void { 
    this.router.navigate(['/chat']); 
  }
  goToPerfil(): void { 
    this.router.navigate(['/perfil']); 
  }
}