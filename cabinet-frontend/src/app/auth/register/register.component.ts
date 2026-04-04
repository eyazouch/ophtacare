import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterRequest } from '../../shared/models/models';

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <div class="auth-card" style="max-width:560px;">
        <div class="logo">
          <svg viewBox="0 0 64 64" width="60" height="60" style="margin-bottom:14px;">
            <defs>
              <linearGradient id="logoGradReg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#34d399"/>
                <stop offset="100%" style="stop-color:#0891b2"/>
              </linearGradient>
            </defs>
            <rect x="26" y="8" width="12" height="48" rx="6" fill="url(#logoGradReg)"/>
            <rect x="8" y="26" width="48" height="12" rx="6" fill="url(#logoGradReg)"/>
            <circle cx="32" cy="32" r="8" fill="white" opacity="0.9"/>
            <circle cx="32" cy="32" r="4" fill="url(#logoGradReg)"/>
          </svg>
          <h1>Créer un compte</h1>
          <p>Rejoignez OphtaCare en quelques étapes</p>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
        </div>

        <form (ngSubmit)="onRegister()">
          <div class="form-row">
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" class="form-control" [(ngModel)]="data.nom" name="nom" placeholder="Ben Ali" required>
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" class="form-control" [(ngModel)]="data.prenom" name="prenom" placeholder="Mohamed" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nom d'utilisateur *</label>
              <input type="text" class="form-control" [(ngModel)]="data.username" name="username" placeholder="patient01" required>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input type="email" class="form-control" [(ngModel)]="data.email" name="email" placeholder="email@exemple.com" required>
            </div>
          </div>
          <div class="form-group">
            <label>Mot de passe *</label>
            <input type="password" class="form-control" [(ngModel)]="data.password" name="password" placeholder="Minimum 6 caractères" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>CIN</label>
              <input type="text" class="form-control" [(ngModel)]="data.cin" name="cin" placeholder="12345678">
            </div>
            <div class="form-group">
              <label>Téléphone *</label>
              <input type="text" class="form-control" [(ngModel)]="data.telephone" name="telephone" placeholder="55 123 456" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Date de naissance *</label>
              <input type="date" class="form-control" [(ngModel)]="data.dateNaissance" name="dateNaissance" required>
            </div>
            <div class="form-group">
              <label>Sexe</label>
              <select class="form-control" [(ngModel)]="data.sexe" name="sexe">
                <option value="">-- Choisir --</option>
                <option value="HOMME">Homme</option>
                <option value="FEMME">Femme</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Adresse</label>
            <input type="text" class="form-control" [(ngModel)]="data.adresse" name="adresse" placeholder="Tunis, Tunisie">
          </div>

          <button type="submit" class="btn btn-primary"
                  style="width:100%;justify-content:center;padding:13px;"
                  [disabled]="loading">
            <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
            <span *ngIf="!loading"><i class="fas fa-user-plus"></i> Créer mon compte</span>
            <span *ngIf="loading">Création...</span>
          </button>
        </form>

        <p style="text-align:center;margin-top:24px;color:#64748b;font-size:14px;">
          Déjà un compte ?
          <a routerLink="/login" style="color:#059669;font-weight:600;">Se connecter</a>
        </p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  data: RegisterRequest = {
    username: '', email: '', password: '',
    nom: '', prenom: '', telephone: '',
    dateNaissance: '', cin: '', adresse: '', sexe: undefined
  };
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.loading = true;
    this.errorMessage = '';
    this.authService.register(this.data).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/patient/dashboard']); },
      error: (err) => { this.loading = false; this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription'; }
    });
  }
}
