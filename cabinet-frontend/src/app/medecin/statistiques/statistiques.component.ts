import { Component, OnInit } from '@angular/core';
import { DashboardService, Statistiques } from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-statistiques',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-chart-pie"></i> Statistiques</h1>
      <button class="btn btn-outline btn-sm" (click)="load()">
        <i class="fas fa-sync"></i> Actualiser
      </button>
    </div>

    <div *ngIf="!stats" style="text-align:center;padding:60px;color:#94a3b8;">
      <i class="fas fa-spinner fa-spin" style="font-size:36px;display:block;margin-bottom:16px;"></i>
      Chargement des statistiques...
    </div>

    <ng-container *ngIf="stats">

      <!-- KPIs -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="icon blue"><i class="fas fa-users"></i></div>
          <div class="info"><h3>{{ stats.totalPatients }}</h3><p>Total patients</p></div>
        </div>
        <div class="stat-card">
          <div class="icon green"><i class="fas fa-calendar-check"></i></div>
          <div class="info"><h3>{{ stats.totalRdv }}</h3><p>Total RDV</p></div>
        </div>
        <div class="stat-card">
          <div class="icon orange"><i class="fas fa-microscope"></i></div>
          <div class="info"><h3>{{ stats.totalAnalyses }}</h3><p>Total analyses</p></div>
        </div>
        <div class="stat-card">
          <div class="icon red"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="info"><h3>{{ stats.rdvUrgents }}</h3><p>RDV urgents</p></div>
        </div>
        <div class="stat-card">
          <div class="icon cyan"><i class="fas fa-percentage"></i></div>
          <div class="info"><h3>{{ stats.tauxAnnulation }}%</h3><p>Taux annulation</p></div>
        </div>
      </div>

      <!-- ROW 1 : Barres + Donut -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">

        <!-- Barres : RDV 7 derniers jours -->
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <h2><i class="fas fa-chart-bar"></i> RDV — 7 derniers jours</h2>
          </div>
          <svg viewBox="0 0 400 220" width="100%" style="overflow:visible;display:block;">
            <defs>
              <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#059669"/>
                <stop offset="100%" style="stop-color:#14b8a6;stop-opacity:0.8"/>
              </linearGradient>
            </defs>
            <!-- Lignes de grille -->
            <line x1="40" y1="20" x2="390" y2="20" stroke="#f1f5f9" stroke-width="1"/>
            <line x1="40" y1="60" x2="390" y2="60" stroke="#f1f5f9" stroke-width="1"/>
            <line x1="40" y1="100" x2="390" y2="100" stroke="#f1f5f9" stroke-width="1"/>
            <line x1="40" y1="140" x2="390" y2="140" stroke="#f1f5f9" stroke-width="1"/>
            <line x1="40" y1="180" x2="390" y2="180" stroke="#e2e8f0" stroke-width="1"/>
            <!-- Barres -->
            <g *ngFor="let d of stats.rdvParJour; let i = index">
              <rect
                [attr.x]="40 + i * 52 + 6"
                [attr.y]="getBarY(d.count)"
                [attr.width]="40"
                [attr.height]="getBarH(d.count)"
                [attr.fill]="d.count > 0 ? 'url(#barGrad)' : '#e2e8f0'"
                rx="6"/>
              <text [attr.x]="40 + i * 52 + 26" [attr.y]="getBarY(d.count) - 5"
                    text-anchor="middle" font-size="11" font-weight="700"
                    [attr.fill]="d.count > 0 ? '#059669' : '#94a3b8'">
                {{ d.count }}
              </text>
              <text [attr.x]="40 + i * 52 + 26" y="200"
                    text-anchor="middle" font-size="11" fill="#64748b" font-weight="600">
                {{ d.label }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Donut : Répartition par statut -->
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <h2><i class="fas fa-chart-pie"></i> Répartition RDV</h2>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:28px;padding:16px;">
            <svg viewBox="0 0 160 160" width="150" height="150">
              <g *ngFor="let s of donutSegments">
                <path [attr.d]="s.path" [attr.fill]="s.color" opacity="0.92"/>
              </g>
              <circle cx="80" cy="80" r="46" fill="white"/>
              <text x="80" y="76" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">
                {{ stats.totalRdv }}
              </text>
              <text x="80" y="93" text-anchor="middle" font-size="9" fill="#94a3b8" font-weight="700">
                TOTAL RDV
              </text>
            </svg>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <div *ngFor="let s of donutSegments" style="display:flex;align-items:center;gap:8px;">
                <div style="width:12px;height:12px;border-radius:3px;flex-shrink:0;"
                     [style.background]="s.color"></div>
                <span style="font-size:13px;color:#475569;">
                  {{ s.label }} <strong style="color:#0f172a;">({{ s.value }})</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 2 : Analyses + Indicateurs -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">

        <!-- Analyses par type -->
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <h2><i class="fas fa-file-medical"></i> Analyses par type</h2>
          </div>
          <div style="padding:8px 0;">
            <div *ngFor="let t of analysesParTypeList; let i = index" style="margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">{{ t.key }}</span>
                <span style="font-size:13px;font-weight:700;" [style.color]="getAnalyseColor(i)">
                  {{ t.value }}
                </span>
              </div>
              <div style="background:#f1f5f9;border-radius:999px;height:8px;overflow:hidden;">
                <div style="height:100%;border-radius:999px;transition:width 0.6s ease;"
                     [style.width]="getAnalysePercent(t.value) + '%'"
                     [style.background]="getAnalyseColor(i)">
                </div>
              </div>
            </div>
            <div *ngIf="analysesParTypeList.length === 0"
                 style="text-align:center;padding:24px;color:#94a3b8;">
              <i class="fas fa-folder-open" style="font-size:32px;display:block;margin-bottom:8px;"></i>
              Aucune analyse pour le moment.
            </div>
          </div>
        </div>

        <!-- Indicateurs -->
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <h2><i class="fas fa-tachometer-alt"></i> Indicateurs clés</h2>
          </div>
          <div style="display:flex;flex-direction:column;gap:18px;padding:8px 0;">
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">Taux d'annulation</span>
                <span style="font-size:14px;font-weight:800;color:#dc2626;">{{ stats.tauxAnnulation }}%</span>
              </div>
              <div style="background:#f1f5f9;border-radius:999px;height:10px;overflow:hidden;">
                <div [style.width]="stats.tauxAnnulation + '%'"
                     style="height:100%;border-radius:999px;background:linear-gradient(90deg,#f87171,#dc2626);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">Taux d'urgence</span>
                <span style="font-size:14px;font-weight:800;color:#f59e0b;">{{ stats.tauxUrgence }}%</span>
              </div>
              <div style="background:#f1f5f9;border-radius:999px;height:10px;overflow:hidden;">
                <div [style.width]="stats.tauxUrgence + '%'"
                     style="height:100%;border-radius:999px;background:linear-gradient(90deg,#fbbf24,#f59e0b);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">Analyses examinées</span>
                <span style="font-size:14px;font-weight:800;color:#059669;">
                  {{ stats.analysesExaminees }}/{{ stats.totalAnalyses }}
                </span>
              </div>
              <div style="background:#f1f5f9;border-radius:999px;height:10px;overflow:hidden;">
                <div [style.width]="getAnalysesExamineesPercent() + '%'"
                     style="height:100%;border-radius:999px;background:linear-gradient(90deg,#34d399,#059669);"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">RDV terminés</span>
                <span style="font-size:14px;font-weight:800;color:#2563eb;">
                  {{ stats.rdvTermines }}/{{ stats.totalRdv }}
                </span>
              </div>
              <div style="background:#f1f5f9;border-radius:999px;height:10px;overflow:hidden;">
                <div [style.width]="getRdvTerminesPercent() + '%'"
                     style="height:100%;border-radius:999px;background:linear-gradient(90deg,#60a5fa,#2563eb);"></div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:4px;">
              <div style="background:#f0fdf4;border-radius:10px;padding:12px;text-align:center;">
                <p style="font-size:24px;font-weight:800;color:#059669;">{{ stats.rdvPrevus }}</p>
                <p style="font-size:12px;color:#64748b;font-weight:500;">RDV confirmés</p>
              </div>
              <div style="background:#fef2f2;border-radius:10px;padding:12px;text-align:center;">
                <p style="font-size:24px;font-weight:800;color:#dc2626;">{{ stats.rdvAnnules }}</p>
                <p style="font-size:12px;color:#64748b;font-weight:500;">RDV annulés</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 3 : Courbe activité -->
      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-chart-line"></i> Activité patients — 4 dernières semaines</h2>
        </div>
        <svg viewBox="0 0 500 130" width="100%" style="overflow:visible;display:block;padding:8px 0;">
          <defs>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#059669;stop-opacity:0.25"/>
              <stop offset="100%" style="stop-color:#059669;stop-opacity:0"/>
            </linearGradient>
          </defs>
          <path [attr.d]="getAreaPath()" fill="url(#areaGrad)"/>
          <path [attr.d]="getLinePath()" fill="none" stroke="#059669" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"/>
          <g *ngFor="let s of stats.nouveauxPatientsParSemaine; let i = index">
            <circle [attr.cx]="getPointX(i)" [attr.cy]="getPointY(s.count)"
                    r="5" fill="white" stroke="#059669" stroke-width="2.5"/>
            <text [attr.x]="getPointX(i)" [attr.y]="getPointY(s.count) - 12"
                  text-anchor="middle" font-size="12" font-weight="700" fill="#059669">
              {{ s.count }}
            </text>
            <text [attr.x]="getPointX(i)" y="125"
                  text-anchor="middle" font-size="12" fill="#64748b" font-weight="600">
              {{ s.label }}
            </text>
          </g>
        </svg>
      </div>

    </ng-container>
  `
})
export class StatistiquesComponent implements OnInit {
  stats: Statistiques | null = null;
  donutSegments: { path: string; color: string; label: string; value: number }[] = [];
  analysesParTypeList: { key: string; value: number }[] = [];
  private maxRdvJour = 1;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.dashboardService.getStatistiques().subscribe({
      next: (data) => {
        this.stats = data;
        this.maxRdvJour = Math.max(1, ...data.rdvParJour.map(d => d.count));
        this.buildDonut();
        this.buildAnalysesType();
      }
    });
  }

  getBarY(count: number): number {
    return 180 - Math.max(count === 0 ? 2 : 8, (count / this.maxRdvJour) * 160);
  }

  getBarH(count: number): number {
    return Math.max(count === 0 ? 2 : 8, (count / this.maxRdvJour) * 160);
  }

  buildDonut(): void {
    if (!this.stats) return;
    const data = [
      { label: 'Prévus', value: this.stats.rdvPrevus, color: '#059669' },
      { label: 'Terminés', value: this.stats.rdvTermines, color: '#2563eb' },
      { label: 'Annulés', value: this.stats.rdvAnnules, color: '#dc2626' },
      { label: 'En attente', value: this.stats.rdvParStatut?.['EN_ATTENTE'] ?? 0, color: '#f59e0b' },
    ].filter(d => d.value > 0);

    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let angle = -Math.PI / 2;

    this.donutSegments = data.map(d => {
      const sweep = (d.value / total) * 2 * Math.PI;
      const cx = 80, cy = 80, r = 65, ri = 46;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      angle += sweep;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const xi1 = cx + ri * Math.cos(angle);
      const yi1 = cy + ri * Math.sin(angle);
      const xi2 = cx + ri * Math.cos(angle - sweep);
      const yi2 = cy + ri * Math.sin(angle - sweep);
      const large = sweep > Math.PI ? 1 : 0;
      return {
        path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${ri} ${ri} 0 ${large} 0 ${xi2} ${yi2} Z`,
        color: d.color, label: d.label, value: d.value
      };
    });
  }

  buildAnalysesType(): void {
    if (!this.stats) return;
    this.analysesParTypeList = Object.entries(this.stats.analysesParType)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => b.value - a.value);
  }

  getAnalysePercent(value: number): number {
    const max = Math.max(1, ...this.analysesParTypeList.map(t => t.value));
    return Math.round((value / max) * 100);
  }

  getAnalyseColor(i: number): string {
    return ['#059669', '#2563eb', '#f59e0b', '#dc2626', '#7c3aed', '#14b8a6'][i % 6];
  }

  getAnalysesExamineesPercent(): number {
    if (!this.stats || !this.stats.totalAnalyses) return 0;
    return Math.round((this.stats.analysesExaminees / this.stats.totalAnalyses) * 100);
  }

  getRdvTerminesPercent(): number {
    if (!this.stats || !this.stats.totalRdv) return 0;
    return Math.round((this.stats.rdvTermines / this.stats.totalRdv) * 100);
  }

  getPointX(i: number): number {
    const n = this.stats?.nouveauxPatientsParSemaine.length ?? 4;
    return 50 + i * (400 / Math.max(1, n - 1));
  }

  getPointY(count: number): number {
    const max = Math.max(1, ...(this.stats?.nouveauxPatientsParSemaine.map(s => s.count) ?? [1]));
    return 90 - (count / max) * 70;
  }

  getLinePath(): string {
    if (!this.stats?.nouveauxPatientsParSemaine.length) return '';
    return this.stats.nouveauxPatientsParSemaine
      .map((s, i) => `${i === 0 ? 'M' : 'L'} ${this.getPointX(i)} ${this.getPointY(s.count)}`)
      .join(' ');
  }

  getAreaPath(): string {
    if (!this.stats?.nouveauxPatientsParSemaine.length) return '';
    const n = this.stats.nouveauxPatientsParSemaine.length;
    const line = this.stats.nouveauxPatientsParSemaine
      .map((s, i) => `${i === 0 ? 'M' : 'L'} ${this.getPointX(i)} ${this.getPointY(s.count)}`)
      .join(' ');
    return `${line} L ${this.getPointX(n - 1)} 100 L ${this.getPointX(0)} 100 Z`;
  }
}