import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequest } from '../../shared/models/models';

@Component({
  selector: 'app-nouveau-patient',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-user-plus"></i> Enregistrer un Patient</h1>
    </div>

    <div class="card">
      <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>
      <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>

      <form (ngSubmit)="onSubmit()">
        <div class="form-row">
          <div class="form-group">
            <label>Nom *</label>
            <input type="text" class="form-control" [(ngModel)]="patient.nom" name="nom" required>
          </div>
          <div class="form-group">
            <label>Prénom *</label>
            <input type="text" class="form-control" [(ngModel)]="patient.prenom" name="prenom" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Nom d'utilisateur *</label>
            <input type="text" class="form-control" [(ngModel)]="patient.username" name="username" required>
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" class="form-control" [(ngModel)]="patient.email" name="email" required>
          </div>
        </div>
        <div class="form-group">
          <label>Mot de passe * <span style="color:#94a3b8;font-weight:400;">(sera communiqué au patient)</span></label>
          <input type="text" class="form-control" [(ngModel)]="patient.password" name="password" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>CIN</label>
            <input type="text" class="form-control" [(ngModel)]="patient.cin" name="cin">
          </div>
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="text" class="form-control" [(ngModel)]="patient.telephone" name="telephone" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Date de naissance *</label>
            <input type="date" class="form-control" [(ngModel)]="patient.dateNaissance" name="dateNaissance" required>
          </div>
          <div class="form-group">
            <label>Sexe</label>
            <select class="form-control" [(ngModel)]="patient.sexe" name="sexe">
              <option value="">-- Choisir --</option>
              <option value="HOMME">Homme</option>
              <option value="FEMME">Femme</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Adresse</label>
          <input type="text" class="form-control" [(ngModel)]="patient.adresse" name="adresse">
        </div>

        <button type="submit" class="btn btn-primary" [disabled]="loading">
          <i class="fas fa-save" *ngIf="!loading"></i>
          <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
          {{ loading ? 'Enregistrement...' : 'Enregistrer le patient' }}
        </button>
      </form>
    </div>
  `
})
export class NouveauPatientComponent {
  patient: RegisterRequest = {
    username: '', email: '', password: '',
    nom: '', prenom: '', telephone: '',
    dateNaissance: '', cin: '', adresse: '', sexe: undefined
  };
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.patient).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Patient enregistré avec succès !';
        setTimeout(() => this.router.navigate(['/secretaire/gestion-patients']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de l\'enregistrement';
      }
    });
  }
}
