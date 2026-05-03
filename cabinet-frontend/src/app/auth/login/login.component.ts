import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LoginRequest } from '../../shared/models/models';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="logo">
          <svg viewBox="0 0 64 64" width="68" height="68" style="margin-bottom: 16px;">
            <defs>
              <linearGradient id="logoGradLogin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#34d399"/>
                <stop offset="100%" style="stop-color:#0891b2"/>
              </linearGradient>
            </defs>
            <rect x="26" y="8" width="12" height="48" rx="6" fill="url(#logoGradLogin)"/>
            <rect x="8" y="26" width="48" height="12" rx="6" fill="url(#logoGradLogin)"/>
            <circle cx="32" cy="32" r="8" fill="white" opacity="0.9"/>
            <circle cx="32" cy="32" r="4" fill="url(#logoGradLogin)"/>
          </svg>
          <h1>OphtaCare</h1>
          <p>Connectez-vous à votre espace</p>
        </div>

        <div class="alert alert-danger" *ngIf="errorMessage">
          <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label><i class="fas fa-user" style="color:#059669;margin-right:6px;"></i>Nom d'utilisateur</label>
            <input type="text" class="form-control" [(ngModel)]="credentials.username"
                   name="username" placeholder="Entrez votre identifiant" required>
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock" style="color:#059669;margin-right:6px;"></i>Mot de passe</label>
            <input type="password" class="form-control" [(ngModel)]="credentials.password"
                   name="password" placeholder="Entrez votre mot de passe" required>
          </div>
          <button type="submit" class="btn btn-primary"
                  style="width:100%;justify-content:center;padding:13px;"
                  [disabled]="loading">
            <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
            <span *ngIf="!loading"><i class="fas fa-sign-in-alt"></i> Se connecter</span>
            <span *ngIf="loading">Connexion...</span>
          </button>
        </form>

        <p style="text-align:center;margin-top:24px;color:#64748b;font-size:14px;">
          Pas encore de compte ?
          <a routerLink="/register" style="color:#059669;font-weight:600;">Créer un compte</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  credentials: LoginRequest = { username: '', password: '' };
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading = true;
    this.errorMessage = '';
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);

        const routes: Record<string, string> = {
          PATIENT: '/patient/dashboard',
          MEDECIN: '/medecin/dashboard',
          SECRETAIRE: '/secretaire/dashboard'
        };
        this.router.navigate([routes[response.role] ?? '/login']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Identifiants incorrects';
      }
    });
  }
}
