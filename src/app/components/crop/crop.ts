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

interface AppState {
  loading: boolean;
  error: string | null;
  operation: 'idle' | 'creating' | 'updating' | 'deleting' | 'fetching';
}

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './crop.html',
  styleUrl: './crop.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
})
export class Crop implements OnInit {
  newCrop: CropData = this.getEmptyCrop();
  crops: CropData[] = [];
  showForm: 'register' | 'edit' | 'list' | 'empty' = 'empty';
  cropToEdit: CropData | null = null;
  
  appState: AppState = {
    loading: false,
    error: null,
    operation: 'idle'
  };
  
  showDeleteModal: boolean = false;
  deleteCropId: number | null = null;

  readonly tiposDeCultivo: string[] = [
    'Hortalizas de hoja', 'Hortalizas de raíz', 'Hierbas aromáticas',
    'Frutales pequeños', 'Legumbres', 'Tubérculos'
  ];

  readonly ubicacionesUrbanas: string[] = [
    'Balcón/Terraza', 'Patio/Jardín trasero', 'Azotea', 'Macetas pequeñas',
    'Huerto vertical interior', 'Invernadero pequeño', 'Recipientes reciclados'
  ];

  constructor(
    private cropService: CropService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getCrops();
  }

  private validateCrop(crop: CropData): { isValid: boolean; error?: string } {
    if (!crop.name?.trim()) {
      return { isValid: false, error: 'El campo Nombre del cultivo es obligatorio.' };
    }
    if (!crop.tipo?.trim()) {
      return { isValid: false, error: 'Debe seleccionar un Tipo de cultivo.' };
    }
    if (!crop.ubicacion?.trim()) {
      return { isValid: false, error: 'Debe seleccionar una Ubicación.' };
    }
    if (!crop.etapa?.trim()) {
      return { isValid: false, error: 'Debe seleccionar una Etapa de crecimiento.' };
    }
    if (!crop.startdate) {
      return { isValid: false, error: 'Debe seleccionar una Fecha de inicio.' };
    }
    if (crop.startdate > new Date()) {
      return { isValid: false, error: 'La fecha de inicio no puede ser futura.' };
    }
    
    return { isValid: true };
  }

  private setLoading(operation: AppState['operation']): void {
    this.appState = { ...this.appState, loading: true, operation, error: null };
  }

  private setSuccess(): void {
    this.appState = { loading: false, error: null, operation: 'idle' };
  }

  private setError(error: string): void {
    this.appState = { loading: false, error, operation: 'idle' };
  }

  getCrops(): void {
    this.setLoading('fetching');
    
    this.cropService.obtenerCultivos().subscribe({
      next: (data) => {
        this.crops = data.map((crop) => ({
          ...crop,
          startdate: new Date(crop.startdate),
        }));
        this.showForm = this.crops.length > 0 ? 'list' : 'empty';
        this.setSuccess();
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(err, 'obtener los cultivos');
        this.setError(errorMessage);
        this.showForm = 'empty';
      },
    });
  }

  addCrop(): void {
    if (this.appState.loading) {
      return;
    }
    const validation = this.validateCrop(this.newCrop);
    if (!validation.isValid) {
      this.setError(validation.error!);
      return;
    }

    this.setLoading('creating');

    const payload = {
      name: this.newCrop.name.trim(),
      tipo: this.newCrop.tipo,
      ubicacion: this.newCrop.ubicacion,
      etapa: this.newCrop.etapa,
      startdate: this.newCrop.startdate.toISOString().split('T')[0],
    };

    this.cropService.registrarCultivo(payload as any).subscribe({
      next: () => {
        this.setSuccess();
        this.getCrops(); 
        this.cancelForm();
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(err, 'registrar el cultivo');
        this.setError(errorMessage);
      },
    });
  }

  saveEdit(): void {
    if (!this.cropToEdit || this.appState.loading) {
      return;
    }

    const validation = this.validateCrop(this.cropToEdit);
    if (!validation.isValid) {
      this.setError(validation.error!);
      return;
    }

    this.setLoading('updating');

    const { id, ...payload } = this.cropToEdit;
    (payload as any).startdate = this.cropToEdit.startdate.toISOString().split('T')[0];

    this.cropService.actualizarCultivo(id, payload).subscribe({
      next: () => {
        this.setSuccess();
        this.getCrops();
        this.cancelForm();
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(err, 'actualizar el cultivo');
        this.setError(errorMessage);
      },
    });
  }

  confirmDelete(id: number): void {
    this.deleteCropId = id;
    this.showDeleteModal = true;
  }

  deleteCrop(): void {
    if (this.deleteCropId === null || this.appState.loading) {
      return;
    }

    this.setLoading('deleting');

    this.cropService.eliminarCultivo(this.deleteCropId).subscribe({
      next: () => {
        this.setSuccess();
        this.getCrops();
        this.closeDeleteModal();
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = this.getErrorMessage(err, 'eliminar el cultivo');
        this.setError(errorMessage);
        this.closeDeleteModal();
      },
    });
  }

  private getErrorMessage(error: HttpErrorResponse, action: string): string {
    if (error.status === 0) {
      return 'Error de conexión. Verifica tu internet e intenta nuevamente.';
    } else if (error.status === 400) {
      return `Datos inválidos para ${action}. Verifica la información.`;
    } else if (error.status === 404) {
      return `Recurso no encontrado al intentar ${action}.`;
    } else if (error.status >= 500) {
      return `Error del servidor al ${action}. Intenta más tarde.`;
    } else {
      return `Error inesperado al ${action}. Código: ${error.status}`;
    }
  }

  private getEmptyCrop(): CropData {
    return { 
      id: 0, 
      name: '', 
      tipo: '', 
      ubicacion: '', 
      etapa: '', 
      startdate: new Date() 
    };
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.deleteCropId = null;
  }

  onDateChange(event: string | null, target: 'new' | 'edit'): void {
    const newDate = event ? new Date(event) : new Date();

    if (target === 'new') {
      this.newCrop.startdate = newDate;
    } else if (target === 'edit' && this.cropToEdit) {
      this.cropToEdit.startdate = newDate;
    }

    this.appState.error = null;
  }

  startRegister(): void {
    this.newCrop = this.getEmptyCrop();
    this.appState.error = null;
    this.showForm = 'register';
  }

  cancelForm(): void {
    this.showForm = this.crops.length > 0 ? 'list' : 'empty';
    this.cropToEdit = null;
    this.appState.error = null;
  }

  enableEdit(crop: CropData): void {
    this.cropToEdit = { ...crop };
    this.appState.error = null;
    this.showForm = 'edit';
  }

  goToCultivoDiario(id: number): void {
    this.router.navigate(['/crop-updates', id]);
  }

  goToInicio(): void { this.router.navigate(['/home']); }
  goToAsistente(): void { this.router.navigate(['/chat']); }
  goToPerfil(): void { this.router.navigate(['/perfil']); }
}