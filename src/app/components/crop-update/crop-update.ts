
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router'; 
import { CommonModule, DatePipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CropUpdateService } from '../../services/crop-update-service';


interface UpdateEntry {
  id?: number; 
  crop_id: string;
  status: string;
  notes: string;
  image_url: string;
  date: Date;
  editMode?: boolean; 
}

@Component({
  selector: 'app-crop-update',
  imports: [ CommonModule, FormsModule, RouterModule ], 
  templateUrl: './crop-update.html',
  styleUrl: './crop-update.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe]
})
export class CropUpdate implements OnInit {

  cropId!: number;
  newUpdate: UpdateEntry = { crop_id: '', status: '', notes: '', image_url: '', date: new Date() };
  updateToEdit: UpdateEntry | null = null;
  updates: UpdateEntry[] = [];
  showForm: 'list' | 'register' | 'edit' = 'list'; 
  
  entryOptions: string[] = [
    'Riego',
    'Aplicación de fertilizante',
    'Problema/Plaga/Enfermedad',
    'Poda/Mantenimiento',
    'Observación General',
    'Cosecha',
    'Abono / Cambio de sustrato',
    'Otra tipo de observación'
  ];

  constructor(
    private route: ActivatedRoute,
    private cropUpdateService: CropUpdateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cropId = Number(this.route.snapshot.paramMap.get('id'));
    this.newUpdate.crop_id = this.cropId.toString();
    this.obtenerActualizaciones();
  }

  obtenerActualizaciones(): void {
    this.cropUpdateService.obtenerActualizacionesPorCultivo(this.cropId).subscribe({
      next: (res) => {
        this.updates = res.map((update: any) => ({
          ...update,
          date: new Date(update.date)
        }));

        if (this.updates.length > 0) { 
            this.showForm = 'list';
        } else {
            this.showForm = 'register';
        }
      },
      error: (err) => {
        console.error('Error al obtener actualizaciones:', err);
        this.updates = [];
        this.showForm = 'register';
      }
    });
  }

  
  handleSubmit(): void {
    if (this.showForm === 'register') {
      this.registrarActualizacion();
    } else if (this.showForm === 'edit' && this.updateToEdit) {
      this.saveEdit();
    }
  }

  registrarActualizacion(): void {
    if (!this.newUpdate.status.trim()) return;

    const payload = {
        ...this.newUpdate,
        date: this.newUpdate.date.toISOString().split('T')[0]
    };

    this.cropUpdateService.registrarActualizacion(payload as any).subscribe({
      next: () => {
        this.newUpdate = { crop_id: this.cropId.toString(), status: '', notes: '', image_url: '', date: new Date() };
        this.obtenerActualizaciones();
      },
      error: (err) => console.error('Error al registrar actualización:', err)
    });
  }

  enableEdit(update: UpdateEntry): void {
    this.updateToEdit = { ...update, date: new Date(update.date) };
    this.showForm = 'edit';
  }

  saveEdit(): void {
    if (!this.updateToEdit || !this.updateToEdit.id) return;
    
    const payload = {
      ...this.updateToEdit,
      date: this.updateToEdit.date.toISOString().split('T')[0] 
    };

    this.cropUpdateService.actualizarActualizacion(this.updateToEdit.id, payload).subscribe({
      next: () => {
        this.updateToEdit = null;
        this.obtenerActualizaciones();
      },
      error: (err) => console.error('Error al actualizar actualización:', err)
    });
  }

  cancelForm(): void {
    this.newUpdate = { crop_id: this.cropId.toString(), status: '', notes: '', image_url: '', date: new Date() };
    this.updateToEdit = null;
    
    
    if (this.updates.length > 0) {
      
      this.showForm = 'list';
    } else {
      
      this.router.navigate(['/cultivos']);
    }
  }

  onDateChange(event: string | null, formType: 'new' | 'edit'): void {
    const newDate = event ? new Date(event) : new Date();

    if (formType === 'new') {
      this.newUpdate.date = newDate;
    } else if (formType === 'edit' && this.updateToEdit) {
      this.updateToEdit.date = newDate;
    }
  }

  deleteUpdate(id: number | undefined): void {
    if (!id) return;
    if (confirm('¿Seguro que deseas eliminar esta actualización?')) {
      this.cropUpdateService.eliminarActualizacion(id).subscribe({
        next: () => this.obtenerActualizaciones(), 
        error: (err) => console.error('Error al eliminar actualización:', err)
      });
    }
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