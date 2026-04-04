import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../shared/services/dashboard.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { Dashboard, RendezVous } from '../../shared/models/models';

@Component({
  selector: 'app-medecin-dashboard',
  template: `
    <div class="page-header">
      <div>
        <h1>Tableau de bord Médecin</h1>
        <p style="color:#64748b;font-size:14px;margin-top:4px;">
          {{ today | date:'EEEE dd MMMM yyyy' }}
        </p>
      </div>
      <button class="btn btn-outline btn-sm" (click)="loadAll()">
        <i class="fas fa-sync"></i> Actualiser
      </button>
    </div>

    <!-- ALERTES URGENTES -->
    <div *ngIf="stats && stats.urgences.length > 0"
         style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #fca5a5;
                border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:44px;height:44px;background:#dc2626;border-radius:12px;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-exclamation-triangle" style="color:white;font-size:18px;"></i>
        </div>
        <div>
          <h3 style="color:#dc2626;font-size:16px;font-weight:700;">
            {{ stats.urgences.length }} RDV urgent(s) aujourd'hui
          </h3>
          <p style="color:#991b1b;font-size:13px;">Ces patients nécessitent une attention immédiate.</p>
        </div>
      </div>
      <div *ngFor="let rdv of stats.urgences"
           style="background:white;border-radius:10px;padding:14px;margin-bottom:8px;
                  border-left:4px solid #dc2626;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <p style="font-weight:700;color:#dc2626;">{{ rdv.patientNomComplet }}</p>
          <p style="font-size:13px;color:#64748b;margin-top:2px;">
            {{ rdv.motif }} — {{ rdv.dateHeure | date:'HH:mm' }}
          </p>
        </div>
        <a [routerLink]="['/medecin/dossier-patient', rdv.patientId]"
           class="btn btn-danger btn-sm">
          <i class="fas fa-folder-open"></i> Voir dossier
        </a>
      </div>
    </div>

    <!-- DEMANDES EN ATTENTE D'ANALYSE -->
    <div *ngIf="stats && stats.analysesEnAttente > 0"
         style="background:linear-gradient(135deg,#fffbeb,#fef3c7);border:2px solid #fde68a;
                border-radius:16px;padding:16px;margin-bottom:24px;
                display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;background:#f59e0b;border-radius:12px;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-microscope" style="color:white;font-size:18px;"></i>
        </div>
        <div>
          <h3 style="color:#92400e;font-size:15px;font-weight:700;">
            {{ stats.analysesEnAttente }} analyse(s) en attente d'examen
          </h3>
          <p style="color:#a16207;font-size:13px;">Des patients attendent votre avis médical.</p>
        </div>
      </div>
      <a routerLink="/medecin/examiner-analyse" class="btn btn-warning btn-sm">
        <i class="fas fa-microscope"></i> Examiner maintenant
      </a>
    </div>

    <!-- STATS -->
    <div class="stats-grid" *ngIf="stats">
      <div class="stat-card">
        <div class="icon blue"><i class="fas fa-users"></i></div>
        <div class="info"><h3>{{ stats.totalPatients }}</h3><p>Total patients</p></div>
      </div>
      <div class="stat-card">
        <div class="icon green"><i class="fas fa-calendar-check"></i></div>
        <div class="info"><h3>{{ stats.rdvDuJour }}</h3><p>RDV aujourd'hui</p></div>
      </div>
      <div class="stat-card">
        <div class="icon red"><i class="fas fa-exclamation-triangle"></i></div>
        <div class="info"><h3>{{ stats.rdvUrgents }}</h3><p>Cas urgents</p></div>
      </div>
      <div class="stat-card">
        <div class="icon orange"><i class="fas fa-microscope"></i></div>
        <div class="info"><h3>{{ stats.analysesEnAttente }}</h3><p>Analyses en attente</p></div>
      </div>
      <div class="stat-card">
        <div class="icon cyan"><i class="fas fa-chart-line"></i></div>
        <div class="info"><h3>{{ stats.tauxAnnulation }}%</h3><p>Taux annulation</p></div>
      </div>
    </div>

    <!-- PLANNING DU JOUR -->
    <div class="card" *ngIf="stats">
      <div class="card-header">
        <h2><i class="fas fa-calendar-day"></i> Planning du jour</h2>
        <a routerLink="/medecin/planning" class="btn btn-outline btn-sm">Planning complet</a>
      </div>

      <div *ngIf="stats.planningDuJour.length === 0"
           style="text-align:center;padding:32px;color:#94a3b8;">
        <i class="fas fa-calendar-times" style="font-size:48px;display:block;margin-bottom:12px;"></i>
        <p>Aucun rendez-vous aujourd'hui.</p>
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
              {{ rdv.motif || 'Consultation générale' }} — {{ rdv.dureeMinutes }} min
            </p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span *ngIf="rdv.urgent" class="badge badge-urgent">
            <i class="fas fa-exclamation-triangle"></i> Urgent
          </span>
          <span class="badge" [ngClass]="getBadge(rdv.statut)">{{ rdv.statut }}</span>
          <a [routerLink]="['/medecin/dossier-patient', rdv.patientId]"
             class="btn btn-outline btn-sm">
            <i class="fas fa-folder-open"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- ANALYSES À EXAMINER -->
    <div class="card" *ngIf="stats && stats.analysesAExaminer.length > 0">
      <div class="card-header">
        <h2><i class="fas fa-microscope"></i> Analyses à examiner</h2>
        <a routerLink="/medecin/examiner-analyse" class="btn btn-outline btn-sm">Voir tout</a>
      </div>
      <div *ngFor="let a of stats.analysesAExaminer.slice(0, 5)"
           style="display:flex;align-items:center;justify-content:space-between;
                  padding:12px;border-radius:10px;margin-bottom:8px;
                  background:#fffbeb;border:1px solid #fde68a;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:38px;height:38px;background:#fef3c7;border-radius:10px;
                      display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-file-medical" style="color:#d97706;"></i>
          </div>
          <div>
            <p style="font-weight:600;font-size:14px;">{{ a.patientNomComplet }}</p>
            <p style="font-size:12px;color:#64748b;">
              {{ a.typeAnalyse }} — {{ a.dateDepot | date:'dd/MM/yyyy HH:mm' }}
            </p>
          </div>
        </div>
        <a routerLink="/medecin/examiner-analyse" class="btn btn-warning btn-sm">
          <i class="fas fa-eye"></i> Examiner
        </a>
      </div>
    </div>
  `
})
export class MedecinDashboardComponent implements OnInit, OnDestroy {
  stats: Dashboard | null = null;
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
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = {
      'PREVU': 'badge-prevu', 'EN_COURS': 'badge-en-cours',
      'TERMINE': 'badge-termine', 'ANNULE': 'badge-annule'
    };
    return map[statut] ?? '';
  }
}