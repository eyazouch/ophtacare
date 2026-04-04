import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { AnalyseService } from '../../shared/services/analyse.service';
import { PatientService } from '../../shared/services/patient.service';
import { RendezVous, Analyse, Patient } from '../../shared/models/models';

@Component({
  selector: 'app-patient-dashboard',
  template: `
    <div class="page-header">
      <div>
        <h1>Bonjour, {{ patient?.prenom || userName }} 👋</h1>
        <p style="color:#64748b;font-size:14px;margin-top:4px;">
          {{ today | date:'EEEE dd MMMM yyyy' }}
        </p>
      </div>
      <a routerLink="/patient/nouveau-rdv" class="btn btn-primary">
        <i class="fas fa-calendar-plus"></i> Nouveau RDV
      </a>
    </div>

    <!-- ALERTE URGENTE -->
    <div *ngIf="rdvUrgents.length > 0"
         style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:2px solid #fca5a5;
                border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="width:44px;height:44px;background:#dc2626;border-radius:12px;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-exclamation-triangle" style="color:white;font-size:18px;"></i>
        </div>
        <div>
          <h3 style="color:#dc2626;font-size:16px;font-weight:700;">
            ⚠️ Rendez-vous urgent requis !
          </h3>
          <p style="color:#991b1b;font-size:13px;">
            Le médecin a examiné vos analyses et nécessite de vous voir en urgence.
          </p>
        </div>
      </div>
      <div *ngFor="let rdv of rdvUrgents"
           style="background:white;border-radius:10px;padding:14px;margin-top:8px;
                  border-left:4px solid #dc2626;">
        <p style="font-weight:600;color:#dc2626;">
          <i class="fas fa-clock" style="margin-right:6px;"></i>
          RDV le {{ rdv.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
        </p>
        <p style="color:#64748b;font-size:13px;margin-top:4px;">{{ rdv.motif }}</p>
      </div>
    </div>

    <!-- ALERTE RDV APPROUVÉ -->
    <div *ngIf="rdvApprouves.length > 0"
         style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:2px solid #6ee7b7;
                border-radius:16px;padding:20px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;background:#059669;border-radius:12px;
                    display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-check" style="color:white;font-size:18px;"></i>
        </div>
        <div>
          <h3 style="color:#065f46;font-size:16px;font-weight:700;">
            ✅ Rendez-vous confirmé !
          </h3>
          <p style="color:#047857;font-size:13px;">
            La secrétaire a approuvé votre demande de rendez-vous.
          </p>
        </div>
      </div>
      <div *ngFor="let rdv of rdvApprouves"
           style="background:white;border-radius:10px;padding:14px;margin-top:12px;
                  border-left:4px solid #059669;">
        <p style="font-weight:600;color:#059669;">
          <i class="fas fa-calendar-check" style="margin-right:6px;"></i>
          {{ rdv.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
        </p>
        <p style="color:#64748b;font-size:13px;margin-top:4px;">
          {{ rdv.motif || 'Consultation générale' }}
        </p>
      </div>
    </div>

    <!-- STATS -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="icon blue"><i class="fas fa-calendar-check"></i></div>
        <div class="info"><h3>{{ rdvPrevus }}</h3><p>RDV confirmés</p></div>
      </div>
      <div class="stat-card">
        <div class="icon orange"><i class="fas fa-clock"></i></div>
        <div class="info"><h3>{{ rdvEnAttente }}</h3><p>Demandes en attente</p></div>
      </div>
      <div class="stat-card">
        <div class="icon green"><i class="fas fa-file-medical"></i></div>
        <div class="info"><h3>{{ analyseList.length }}</h3><p>Analyses déposées</p></div>
      </div>
      <div class="stat-card">
        <div class="icon cyan"><i class="fas fa-comment-medical"></i></div>
        <div class="info"><h3>{{ analysesExaminees }}</h3><p>Avis reçus</p></div>
      </div>
    </div>

    <!-- PROCHAIN RDV -->
    <div class="card" *ngIf="prochainRdv">
      <div class="card-header">
        <h2><i class="fas fa-calendar-alt"></i> Prochain Rendez-vous</h2>
        <span class="badge badge-prevu">Confirmé</span>
      </div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;align-items:center;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:52px;height:52px;background:#dbeafe;border-radius:14px;
                      display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-calendar" style="color:#2563eb;font-size:20px;"></i>
          </div>
          <div>
            <p style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Date</p>
            <p style="font-weight:700;font-size:15px;">{{ prochainRdv.dateHeure | date:'dd/MM/yyyy' }}</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:52px;height:52px;background:#d1fae5;border-radius:14px;
                      display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-clock" style="color:#059669;font-size:20px;"></i>
          </div>
          <div>
            <p style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Heure</p>
            <p style="font-weight:700;font-size:15px;">{{ prochainRdv.dateHeure | date:'HH:mm' }}</p>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:52px;height:52px;background:#ede9fe;border-radius:14px;
                      display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-stethoscope" style="color:#7c3aed;font-size:20px;"></i>
          </div>
          <div>
            <p style="font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Motif</p>
            <p style="font-weight:700;font-size:15px;">{{ prochainRdv.motif || 'Consultation générale' }}</p>
          </div>
        </div>
        <div style="margin-left:auto;">
          <a routerLink="/patient/mes-rdv" class="btn btn-outline btn-sm">
            <i class="fas fa-list"></i> Voir tous mes RDV
          </a>
        </div>
      </div>
    </div>

    <!-- PAS DE RDV -->
    <div class="card" *ngIf="!prochainRdv && rdvEnAttente === 0"
         style="text-align:center;padding:32px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);">
      <i class="fas fa-calendar-plus" style="font-size:48px;color:#059669;display:block;margin-bottom:16px;"></i>
      <h3 style="font-weight:700;margin-bottom:8px;">Aucun rendez-vous prévu</h3>
      <p style="color:#64748b;margin-bottom:20px;">Prenez rendez-vous avec votre médecin dès maintenant.</p>
      <a routerLink="/patient/nouveau-rdv" class="btn btn-primary">
        <i class="fas fa-calendar-plus"></i> Prendre un rendez-vous
      </a>
    </div>

    <!-- DERNIÈRES ANALYSES -->
    <div class="card">
      <div class="card-header">
        <h2><i class="fas fa-file-medical"></i> Mes Dernières Analyses</h2>
        <a routerLink="/patient/mes-analyses" class="btn btn-outline btn-sm">Voir tout</a>
      </div>
      <div *ngIf="analyseList.length === 0" style="text-align:center;padding:24px;color:#94a3b8;">
        <i class="fas fa-folder-open" style="font-size:36px;display:block;margin-bottom:12px;"></i>
        <p>Aucune analyse déposée.</p>
        <a routerLink="/patient/upload-analyse" class="btn btn-outline btn-sm" style="margin-top:12px;">
          <i class="fas fa-upload"></i> Déposer une analyse
        </a>
      </div>
      <div *ngFor="let a of analyseList.slice(0, 3)"
           style="display:flex;align-items:center;justify-content:space-between;
                  padding:14px;border-radius:10px;margin-bottom:8px;
                  background:#f8fafc;border:1px solid #e2e8f0;">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:40px;height:40px;border-radius:10px;background:#dbeafe;
                      display:flex;align-items:center;justify-content:center;">
            <i class="fas fa-file-medical" style="color:#2563eb;"></i>
          </div>
          <div>
            <p style="font-weight:600;font-size:14px;">{{ a.typeAnalyse }}</p>
            <p style="font-size:12px;color:#94a3b8;">{{ a.dateDepot | date:'dd/MM/yyyy' }}</p>
          </div>
        </div>
        <div style="text-align:right;">
          <span class="badge" [ngClass]="getBadgeAnalyse(a.statut)">{{ a.statut }}</span>
          <p *ngIf="a.commentaireMedecin"
             style="font-size:12px;color:#059669;margin-top:4px;max-width:200px;
                    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            <i class="fas fa-comment-medical"></i> {{ a.commentaireMedecin }}
          </p>
        </div>
      </div>
    </div>

    <!-- ACTIONS RAPIDES -->
    <div class="card">
      <div class="card-header">
        <h2><i class="fas fa-bolt"></i> Actions rapides</h2>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;">
        <a routerLink="/patient/nouveau-rdv"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#ecfdf5;border-radius:12px;border:1px solid #a7f3d0;cursor:pointer;text-decoration:none;">
          <i class="fas fa-calendar-plus" style="font-size:20px;color:#059669;"></i>
          <span style="font-weight:600;color:#065f46;">Nouveau RDV</span>
        </a>
        <a routerLink="/patient/upload-analyse"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#dbeafe;border-radius:12px;border:1px solid #93c5fd;cursor:pointer;text-decoration:none;">
          <i class="fas fa-upload" style="font-size:20px;color:#2563eb;"></i>
          <span style="font-weight:600;color:#1e40af;">Déposer analyse</span>
        </a>
        <a routerLink="/patient/mes-rdv"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#fef3c7;border-radius:12px;border:1px solid #fde68a;cursor:pointer;text-decoration:none;">
          <i class="fas fa-list" style="font-size:20px;color:#d97706;"></i>
          <span style="font-weight:600;color:#92400e;">Mes RDV</span>
        </a>
        <a routerLink="/patient/profil"
           style="display:flex;align-items:center;gap:12px;padding:16px;
                  background:#f3e8ff;border-radius:12px;border:1px solid #d8b4fe;cursor:pointer;text-decoration:none;">
          <i class="fas fa-user-circle" style="font-size:20px;color:#7c3aed;"></i>
          <span style="font-weight:600;color:#5b21b6;">Mon profil</span>
        </a>
      </div>
    </div>
  `
})
export class PatientDashboardComponent implements OnInit, OnDestroy {
  patient: Patient | null = null;
  rdvList: RendezVous[] = [];
  analyseList: Analyse[] = [];
  prochainRdv: RendezVous | null = null;
  rdvUrgents: RendezVous[] = [];
  rdvApprouves: RendezVous[] = [];
  rdvPrevus = 0;
  rdvEnAttente = 0;
  analysesExaminees = 0;
  patientId = 0;
  userName = '';
  today = new Date();
  private refreshInterval: any;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private rdvService: RendezVousService,
    private analyseService: AnalyseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.username;
      this.patientService.getByUserId(user.userId).subscribe({
        next: (p) => { this.patient = p; this.patientId = p.id; this.loadData(); },
        error: () => {
          this.patientService.getAll(0, 200).subscribe(page => {
            const found = page.content.find(p => p.email === user.email);
            if (found) { this.patient = found; this.patientId = found.id; this.loadData(); }
          });
        }
      });
    }
    this.refreshInterval = setInterval(() => { if (this.patientId) this.loadData(); }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadData(): void {
    this.rdvService.getByPatient(this.patientId).subscribe(list => {
      this.rdvList = list;
      const now = new Date();
      this.rdvUrgents = list.filter(r => r.urgent && r.statut === 'PREVU' && new Date(r.dateHeure) > now);
      const hier = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      this.rdvApprouves = list.filter(r =>
        r.statut === 'PREVU' && !r.urgent &&
        new Date(r.dateCreation) > hier &&
        new Date(r.dateHeure) > now
      );
      this.rdvPrevus = list.filter(r => r.statut === 'PREVU').length;
      this.rdvEnAttente = list.filter(r => (r.statut as string) === 'EN_ATTENTE_APPROBATION').length;
      const futursConfirmes = list
        .filter(r => r.statut === 'PREVU' && new Date(r.dateHeure) > now)
        .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime());
      this.prochainRdv = futursConfirmes[0] ?? null;
    });
    this.analyseService.getByPatient(this.patientId).subscribe(list => {
      this.analyseList = list;
      this.analysesExaminees = list.filter(a => a.statut === 'EXAMINEE').length;
    });
  }

  getBadgeAnalyse(statut: string): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'badge-en-attente', 'EXAMINEE': 'badge-examinee', 'ARCHIVEE': 'badge-termine'
    };
    return map[statut] ?? '';
  }
}