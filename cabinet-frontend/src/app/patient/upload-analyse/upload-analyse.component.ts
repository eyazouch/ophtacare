import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PatientService } from '../../shared/services/patient.service';
import { AnalyseService } from '../../shared/services/analyse.service';

@Component({
  selector: 'app-upload-analyse',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-upload"></i> Déposer une Analyse</h1>
    </div>

    <div class="card">
      <div class="alert alert-danger" *ngIf="errorMessage">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="alert alert-success" *ngIf="successMessage">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>

      <form (ngSubmit)="onUpload()">
        <div class="form-group">
          <label>Type d'analyse *</label>
          <select class="form-control" [(ngModel)]="typeAnalyse" name="typeAnalyse" required>
            <option value="">-- Sélectionner le type --</option>
            <option value="Radio oculaire">Radio oculaire</option>
            <option value="IRM">IRM</option>
            <option value="Scanner">Scanner</option>
            <option value="Bilan sanguin">Bilan sanguin</option>
            <option value="Fond d'oeil">Fond d'oeil</option>
            <option value="Champ visuel">Champ visuel</option>
            <option value="OCT">OCT (Tomographie)</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div class="form-group">
          <label>Fichier (PDF, JPEG, PNG — max 10 Mo) *</label>
          <div class="upload-zone"
               (click)="fileInput.click()"
               (dragover)="onDragOver($event)"
               (drop)="onDrop($event)"
               [class.has-file]="selectedFile">
            <input type="file" #fileInput
                   (change)="onFileSelected($event)"
                   accept=".pdf,.jpg,.jpeg,.png" hidden>
            <div *ngIf="!selectedFile">
              <i class="fas fa-cloud-upload-alt" style="font-size:48px;color:#94a3b8;"></i>
              <p style="margin-top:12px;color:#64748b;">
                Glissez-déposez votre fichier ici ou
                <strong style="color:#2563eb;">parcourez</strong>
              </p>
              <p style="font-size:12px;color:#94a3b8;">PDF, JPEG, PNG (max 10 Mo)</p>
            </div>
            <div *ngIf="selectedFile" style="color:#16a34a;">
              <i class="fas fa-check-circle" style="font-size:36px;"></i>
              <p style="margin-top:8px;font-weight:500;">{{ selectedFile.name }}</p>
              <p style="font-size:12px;color:#64748b;">
                {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} Mo
              </p>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary"
                [disabled]="loading || !selectedFile || !typeAnalyse || patientId === 0">
          <i class="fas fa-upload" *ngIf="!loading"></i>
          <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
          <span *ngIf="!loading">Déposer l'analyse</span>
          <span *ngIf="loading">Envoi en cours...</span>
        </button>
      </form>
    </div>
  `,
  styles: [`
    .upload-zone {
      border: 2px dashed #cbd5e1;
      border-radius: 12px;
      padding: 48px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #f8fafc;
    }
    .upload-zone:hover { border-color: #059669; background: #ecfdf5; }
    .upload-zone.has-file { border-color: #16a34a; background: #f0fdf4; border-style: solid; }
  `]
})
export class UploadAnalyseComponent implements OnInit {
  typeAnalyse = '';
  selectedFile: File | null = null;
  loading = false;
  errorMessage = '';
  successMessage = '';
  patientId = 0;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private analyseService: AnalyseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getByUserId(user.userId).subscribe({
        next: (p) => { this.patientId = p.id; },
        error: () => {
          this.patientService.getAll(0, 200).subscribe({
            next: (page) => {
              const found = page.content.find(p => p.email === user.email);
              if (found) this.patientId = found.id;
              else this.errorMessage = 'Profil patient introuvable.';
            }
          });
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onUpload(): void {
    if (!this.selectedFile || !this.typeAnalyse || !this.patientId) return;
    this.loading = true;
    this.errorMessage = '';

    this.analyseService.upload(this.patientId, this.typeAnalyse, this.selectedFile).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Analyse déposée avec succès !';
        setTimeout(() => this.router.navigate(['/patient/mes-analyses']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi du fichier.';
      }
    });
  }
}