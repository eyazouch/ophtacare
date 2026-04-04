import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../shared/services/dashboard.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { Dashboard, RendezVous } from '../../shared/models/models';

@Component({
  selector: 'app-secretaire-dashboard',
  template: `
    <div class="page-header">
      <div>
        <h1>Tableau de bord Secrétaire</h1>
        <p style="color:#64748b;font-size:14px;margin-top:4px;">
          {{ today | date:'EEEE dd MMMM yyyy' }}
        </p>
      </div>
      <button class="btn btn-outline btn-sm" (click)="loadAll()">
        <i class="fas fa-sync"></i> Actualiser
      </button>
    </div>

    <!-- ALERTE DEMANDES EN ATTENTE -->
    <div *ngIf="demandesEnAttente.length > 0"
         style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:2px solid #fde68a;
                border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:44px;height:44px;background:#f59e0b;border-radius:12px;
                      display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-bell" style="color:white;font-size:18px;"></i>
          </div>
          <div>
            <h3 style="color:#92400e;font-size:16px;font-weight:700;">
              {{ demandesEnAttente.length }} demande(s) en attente d'approbation
            </h3>
            <p style="color:#a16207;font-size:13px;">
              Des patients attendent la confirmation de leur rendez-vous.
            </p>
          </div>
        </div>
        <a routerLink="/secretaire/gestion-rdv" class="btn btn-primary btn-sm">
          <i class="fas fa-calendar-check"></i> Gérer les demandes
        </a>
      </div>

      <!-- Aperçu des demandes -->
      <div *ngFor="let rdv of demandesEnAttente.slice(0, 3)"
           style="background:white;border-radius:10px;padding:12px;margin-top:10px;
                  border-left:4px solid #f59e0b;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="font-weight:700;font-size:14px;">{{ rdv.patientNomComplet }}</p>
          <p style="font-size:12px;color:#64748b;margin-top:2px;">
            Créneau 1 : {{ rdv.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
            <span *ngIf="rdv.dateHeureAlt">
              | Créneau 2 : {{ rdv.dateHeureAlt | date:'dd/MM/yyyy à HH:mm' }}
            </span>
          </p>
        </div>
        <span class="badge badge-en-attente">En attente</span>
      </div>
      <p *ngIf="demandesEnAttente.length > 3"
         style="text-align:center;color:#a16207;font-size:13px;margin-top:10px;">
        + {{ demandesEnAttente.length - 3 }} autre(s) demande(s)
      </p>
    </div>

    <!-- ALERTES URGENCES -->
    <div *ngIf="stats && stats.urgences.length > 0"
         style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #fca5a5;
                border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:44px;height:44px;background:#dc2626;border-radius:12px;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-exclamation-triangle" style="color:white;font-size:18px;"></i>
        </div>
        <div>
          <h3 style="color:#dc2626;font-size:16px;font-weight:700;">
            {{ stats.urgences.length }} RDV urgent(s)
          </h3>
          <p style="color:#991b1b;font-size:13px;">Planifiés par le médecin en urgence.</p>
        </div>
      </div>
      <div *ngFor="let u of stats.urgences"
           style="background:white;border-radius:10px;padding:12px;margin-bottom:8px;
                  border-left:4px solid #dc2626;">
        <p style="font-weight:700;color:#dc2626;">{{ u.patientNomComplet }}</p>
        <p style="font-size:13px;color:#64748b;">
          {{ u.motif }} — {{ u.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
        </p>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid" *ngIf="stats">
      <div class="stat-card">
        <div class="icon blue"><i class="fas fa-users"></i></div>
        <div class="info"><h3>{{ stats.totalPatients }}</h3><p>Patients</p></div>
      </div>
      <div class="stat-card">
        <div class="icon green"><i class="fas fa-calendar-day"></i></div>
        <div class="info"><h3>{{ stats.rdvDuJour }}</h3><p>RDV aujourd'hui</p></div>
      </div>
      <div class="stat-card">
        <div class="icon orange"><i class="fas fa-clock"></i></div>
        <div class="info"><h3>{{ demandesEnAttente.length }}</h3><p>Demandes en attente</p></div>
      </div>
      <div class="stat-card">
        <div class="icon red"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="info"><h3>{{ stats.rdvUrgents }}</h3><p>Urgences</p></div>
      </div>
    </div>

    <!-- PLANNING DU JOUR -->
    <div class="card" *ngIf="stats">
      <div class="card-header">
        <h2><i class="fas fa-calendar-day"></i> Planning confirmé du jour</h2>
        <a routerLink="/secretaire/gestion-rdv" class="btn btn-primary btn-sm">
          <i class="fas fa-calendar-alt"></i> Gérer les RDV
        </a>
      </div>

      <div *ngIf="stats.planningDuJour.length === 0"
           style="text-align:center;padding:32px;color:#94a3b8;">
        <i class="fas fa-calendar-times" style="font-size:48px;display:block;margin-bottom:12px;"></i>
        <p>Aucun RDV confirmé aujourd'hui.</p>
      </div>

      <div *ngFor="let rdv of stats.planningDuJour"
           style="display:flex;align-items:center;justify-content:space-between;
                  padding:14px;border-radius:10px;margin-bottom:8px;
                  border:1px solid #e2e8f0;"
           [style.background]="rdv.urgent ? '#fef2f2' : '#f8fafc'">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:52px;height:52px;border-radius:12px;
                      display:flex;align-items:center;justify-content:center;flex-shrink:0;"
               [style.background]="rdv.urgent ? '#fee2e2' : '#d1fae5'">
            <span style="font-weight:800;font-size:15px;"
                  [style.color]="rdv.urgent ? '#dc2626' : '#059669'">
              {{ rdv.dateHeure | date:'HH:mm' }}
            </span>
          </div>
          <div>
            <p style="font-weight:700;font-size:14px;">{{ rdv.patientNomComplet }}</p>
            <p style="font-size:12px;color:#64748b;margin-top:2px;">
              {{ rdv.motif || 'Consultation' }}
            </p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span *ngIf="rdv.urgent" class="badge badge-urgent">
            <i class="fas fa-exclamation-triangle"></i> Urgent
          </span>
          <span class="badge" [ngClass]="getBadge(rdv.statut)">{{ rdv.statut }}</span>
        </div>
      </div>
    </div>

    <!-- ACTIONS RAPIDES -->
    <div class="card">
      <div class="card-header">
        <h2><i class="fas fa-bolt"></i> Actions rapides</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;">
        <a routerLink="/secretaire/gestion-rdv"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#ecfdf5;border-radius:12px;border:1px solid #a7f3d0;
                  cursor:pointer;text-decoration:none;">
          <i class="fas fa-calendar-check" style="font-size:20px;color:#059669;"></i>
          <span style="font-weight:600;color:#065f46;">Gérer RDV</span>
        </a>
        <a routerLink="/secretaire/nouveau-patient"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#dbeafe;border-radius:12px;border:1px solid #93c5fd;
                  cursor:pointer;text-decoration:none;">
          <i class="fas fa-user-plus" style="font-size:20px;color:#2563eb;"></i>
          <span style="font-weight:600;color:#1e40af;">Nouveau patient</span>
        </a>
        <a routerLink="/secretaire/gestion-patients"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#fef3c7;border-radius:12px;border:1px solid #fde68a;
                  cursor:pointer;text-decoration:none;">
          <i class="fas fa-users" style="font-size:20px;color:#d97706;"></i>
          <span style="font-weight:600;color:#92400e;">Liste patients</span>
        </a>
      </div>
    </div>
  `
})
export class SecretaireDashboardComponent implements OnInit, OnDestroy {
  stats: Dashboard | null = null;
  demandesEnAttente: RendezVous[] = [];
  today = new Date();
  private refreshInterval: any;

  constructor(
    private dashboardService: DashboardService,
    private rdvService: RendezVousService
  ) {}

  ngOnInit(): void {
    this.loadAll();
    this.refreshInterval = setInterval(() => this.loadAll(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadAll(): void {
    this.dashboardService.getStats().subscribe(data => this.stats = data);
    this.rdvService.getDemandesEnAttente().subscribe(list => this.demandesEnAttente = list);
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = {
      'PREVU': 'badge-prevu', 'EN_COURS': 'badge-en-cours',
      'TERMINE': 'badge-termine', 'ANNULE': 'badge-annule'
    };
    return map[statut] ?? '';
  }
}