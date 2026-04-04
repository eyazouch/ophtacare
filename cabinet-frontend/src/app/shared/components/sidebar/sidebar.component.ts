import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-icon">
          <svg viewBox="0 0 64 64" width="38" height="38">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#34d399"/>
                <stop offset="100%" style="stop-color:#0891b2"/>
              </linearGradient>
            </defs>
            <rect x="26" y="8" width="12" height="48" rx="6" fill="url(#logoGrad)"/>
            <rect x="8" y="26" width="48" height="12" rx="6" fill="url(#logoGrad)"/>
            <circle cx="32" cy="32" r="8" fill="white" opacity="0.9"/>
            <circle cx="32" cy="32" r="4" fill="url(#logoGrad)"/>
          </svg>
        </div>
        <div>
          <h2>OphtaCare</h2>
          <span class="subtitle">Cabinet d'Ophtalmologie</span>
        </div>
      </div>
      <div class="sidebar-user">
        <div class="avatar">{{ userInitial }}</div>
        <div>
          <p class="user-name">{{ userName }}</p>
          <p class="user-role">{{ userRoleLabel }}</p>
        </div>
      </div>
      <nav class="sidebar-nav">
        <p class="nav-section" *ngIf="role === 'PATIENT'">Espace Patient</p>
        <p class="nav-section" *ngIf="role === 'MEDECIN'">Espace Médecin</p>
        <p class="nav-section" *ngIf="role === 'SECRETAIRE'">Espace Secrétaire</p>

        <ng-container *ngIf="role === 'PATIENT'">
          <a routerLink="/patient/dashboard" routerLinkActive="active"><i class="fas fa-th-large"></i> Tableau de bord</a>
          <a routerLink="/patient/mes-rdv" routerLinkActive="active"><i class="fas fa-calendar-alt"></i> Mes Rendez-vous</a>
          <a routerLink="/patient/nouveau-rdv" routerLinkActive="active"><i class="fas fa-calendar-plus"></i> Nouveau RDV</a>
          <a routerLink="/patient/mes-analyses" routerLinkActive="active"><i class="fas fa-file-medical"></i> Mes Analyses</a>
          <a routerLink="/patient/upload-analyse" routerLinkActive="active"><i class="fas fa-cloud-upload-alt"></i> Déposer Analyse</a>
          <a routerLink="/patient/profil" routerLinkActive="active"><i class="fas fa-user-circle"></i> Mon Profil</a>
        </ng-container>

        <ng-container *ngIf="role === 'MEDECIN'">
          <a routerLink="/medecin/dashboard" routerLinkActive="active"><i class="fas fa-th-large"></i> Tableau de bord</a>
          <a routerLink="/medecin/planning" routerLinkActive="active"><i class="fas fa-calendar-week"></i> Planning</a>
          <a routerLink="/medecin/examiner-analyse" routerLinkActive="active"><i class="fas fa-microscope"></i> Analyses en attente</a>
          <a routerLink="/medecin/statistiques" routerLinkActive="active"><i class="fas fa-chart-pie"></i> Statistiques</a>
        </ng-container>

        <ng-container *ngIf="role === 'SECRETAIRE'">
          <a routerLink="/secretaire/dashboard" routerLinkActive="active"><i class="fas fa-th-large"></i> Tableau de bord</a>
          <a routerLink="/secretaire/gestion-patients" routerLinkActive="active"><i class="fas fa-users"></i> Patients</a>
          <a routerLink="/secretaire/nouveau-patient" routerLinkActive="active"><i class="fas fa-user-plus"></i> Nouveau Patient</a>
          <a routerLink="/secretaire/gestion-rdv" routerLinkActive="active"><i class="fas fa-calendar-check"></i> Rendez-vous</a>
        </ng-container>
      </nav>
      <div class="sidebar-footer">
        <a (click)="logout()" class="logout-btn"><i class="fas fa-sign-out-alt"></i> Déconnexion</a>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar { width: 270px; height: 100vh; position: fixed; left: 0; top: 0; background: linear-gradient(180deg, #064e3b 0%, #052e16 100%); color: white; display: flex; flex-direction: column; z-index: 100; box-shadow: 4px 0 20px rgba(0,0,0,0.15); }
    .sidebar-header { padding: 24px 20px; display: flex; align-items: center; gap: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .logo-icon { width: 44px; height: 44px; background: rgba(255,255,255,0.08); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .sidebar-header h2 { font-family: 'DM Serif Display', serif; font-size: 18px; font-weight: 400; color: #d1fae5; }
    .sidebar-header .subtitle { font-size: 10px; color: #6ee7b7; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
    .sidebar-user { padding: 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
    .avatar { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg, #059669, #14b8a6); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 17px; box-shadow: 0 2px 8px rgba(5,150,105,0.4); }
    .user-name { font-size: 14px; font-weight: 600; color: #f0fdf4; }
    .user-role { font-size: 11px; color: #6ee7b7; font-weight: 500; }
    .sidebar-nav { flex: 1; padding: 12px; overflow-y: auto; }
    .nav-section { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #6ee7b7; padding: 8px 16px 6px; margin-top: 4px; }
    .sidebar-nav a { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #a7f3d0; border-radius: 10px; font-size: 14px; font-weight: 500; margin-bottom: 3px; cursor: pointer; transition: all 0.2s ease; }
    .sidebar-nav a:hover { background: rgba(5,150,105,0.2); color: white; transform: translateX(3px); }
    .sidebar-nav a.active { background: linear-gradient(135deg, #059669, #0d9488); color: white; box-shadow: 0 2px 10px rgba(5,150,105,0.4); font-weight: 600; }
    .sidebar-nav a i { width: 20px; text-align: center; font-size: 15px; }
    .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.08); }
    .logout-btn { display: flex; align-items: center; gap: 12px; padding: 11px 16px; color: #fca5a5; border-radius: 10px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; }
    .logout-btn:hover { background: rgba(239,68,68,0.15); color: #fecaca; }
  `]
})
export class SidebarComponent implements OnInit {
  role: string | null = '';
  userName = '';
  userInitial = '';
  userRoleLabel = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.role = user.role;
      this.userName = user.username;
      this.userInitial = user.username.charAt(0).toUpperCase();
      const labels: Record<string, string> = { PATIENT: 'Patient', MEDECIN: 'Médecin', SECRETAIRE: 'Secrétaire' };
      this.userRoleLabel = labels[user.role] ?? user.role;
    }
  }

  logout(): void { this.authService.logout(); }
}
