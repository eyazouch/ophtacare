import { Component, OnInit } from '@angular/core';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { RendezVous } from '../../shared/models/models';

@Component({
  selector: 'app-gestion-rdv',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-calendar-check"></i> Gestion des Rendez-vous</h1>
    </div>

    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>
    <div class="alert alert-danger" *ngIf="errorMessage">{{ errorMessage }}</div>

    <!-- Demandes en attente -->
    <div class="card" *ngIf="demandes.length > 0">
      <div class="card-header">
        <h2><i class="fas fa-clock"></i> Demandes en attente d'approbation</h2>
        <span class="badge badge-en-attente">{{ demandes.length }}</span>
      </div>
      <div *ngFor="let rdv of demandes" style="border:1px solid #fde68a;border-radius:12px;padding:18px;margin-bottom:12px;background:#fffbeb;">
        <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:12px;">
          <div>
            <strong style="font-size:15px;">{{ rdv.patientNomComplet }}</strong>
            <p style="color:#64748b;margin-top:4px;font-size:13px;">
              {{ rdv.motif || 'Pas de motif' }}
            </p>
            <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">Créneau 1 :</span>
                <button class="btn btn-sm"
                        [ngClass]="rdv.id === selectedRdvId && selectedDateTime === rdv.dateHeure ? 'btn-primary' : 'btn-outline'"
                        (click)="selectCreneau(rdv, rdv.dateHeure)">
                  <i class="fas fa-calendar"></i>
                  {{ rdv.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
                </button>
              </div>
              <div *ngIf="rdv.dateHeureAlt" style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:13px;font-weight:600;color:#334155;">Créneau 2 :</span>
                <button class="btn btn-sm"
                        [ngClass]="rdv.id === selectedRdvId && selectedDateTime === rdv.dateHeureAlt ? 'btn-primary' : 'btn-outline'"
                        (click)="selectCreneau(rdv, rdv.dateHeureAlt)">
                  <i class="fas fa-calendar"></i>
                  {{ rdv.dateHeureAlt | date:'dd/MM/yyyy à HH:mm' }}
                </button>
              </div>
            </div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-success btn-sm"
                    [disabled]="rdv.id !== selectedRdvId || !selectedDateTime"
                    (click)="approuver(rdv)">
              <i class="fas fa-check"></i> Approuver
            </button>
            <button class="btn btn-danger btn-sm" (click)="refuser(rdv.id)">
              <i class="fas fa-times"></i> Refuser
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card" *ngIf="demandes.length === 0" style="text-align:center;padding:30px;color:#94a3b8;">
      <i class="fas fa-check-circle" style="font-size:36px;color:#16a34a;display:block;margin-bottom:12px;"></i>
      Aucune demande en attente.
    </div>

    <!-- Planning par date -->
    <div class="card">
      <div class="card-header">
        <h2><i class="fas fa-calendar-day"></i> Planning confirmé</h2>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap;">
        <input type="date" class="form-control" [(ngModel)]="selectedDate"
               (change)="loadPlanning()" style="max-width:200px;">
        <button class="btn btn-primary btn-sm" (click)="goToday()">Aujourd'hui</button>
      </div>
      <div class="table-container">
        <table *ngIf="rdvList.length > 0">
          <thead>
            <tr><th>Heure</th><th>Patient</th><th>Motif</th><th>Statut</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let rdv of rdvList" [style.background]="rdv.urgent ? '#fef2f2' : ''">
              <td><strong>{{ rdv.dateHeure | date:'HH:mm' }}</strong></td>
              <td>{{ rdv.patientNomComplet }}</td>
              <td>{{ rdv.motif || '—' }}</td>
              <td><span class="badge" [ngClass]="getBadge(rdv.statut)">{{ rdv.statut }}</span></td>
              <td>
                <button class="btn btn-danger btn-sm" *ngIf="rdv.statut === 'PREVU'" (click)="annuler(rdv.id)">
                  <i class="fas fa-times"></i> Annuler
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="rdvList.length === 0" style="text-align:center;padding:30px;color:#94a3b8;">
          Aucun RDV confirmé pour cette date.
        </p>
      </div>
    </div>
  `
})
export class GestionRdvComponent implements OnInit {
  demandes: RendezVous[] = [];
  rdvList: RendezVous[] = [];
  selectedDate = new Date().toISOString().split('T')[0];
  successMessage = ''; errorMessage = '';
  selectedRdvId: number | null = null;
  selectedDateTime: string | null = null;

  constructor(private rdvService: RendezVousService) {}

  ngOnInit(): void {
    this.loadDemandes();
    this.loadPlanning();
  }

  loadDemandes(): void {
    this.rdvService.getDemandesEnAttente().subscribe(list => this.demandes = list);
  }

  loadPlanning(): void {
    this.rdvService.getPlanning(this.selectedDate).subscribe(list => this.rdvList = list);
  }

  goToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadPlanning();
  }

  selectCreneau(rdv: RendezVous, dateHeure: string): void {
    this.selectedRdvId = rdv.id;
    this.selectedDateTime = dateHeure;
  }

  approuver(rdv: RendezVous): void {
    if (!this.selectedDateTime) return;
    this.rdvService.approuver(rdv.id, this.selectedDateTime).subscribe({
      next: () => {
        this.successMessage = `RDV de ${rdv.patientNomComplet} confirmé !`;
        this.selectedRdvId = null; this.selectedDateTime = null;
        this.loadDemandes(); this.loadPlanning();
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => { this.errorMessage = err.error?.message || 'Erreur'; }
    });
  }

  refuser(id: number): void {
    if (confirm('Confirmer le refus de cette demande ?')) {
      this.rdvService.refuser(id).subscribe({
        next: () => {
          this.successMessage = 'Demande refusée.';
          this.loadDemandes();
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    }
  }

  annuler(id: number): void {
    if (confirm('Annuler ce rendez-vous ?')) {
      this.rdvService.cancel(id).subscribe({
        next: () => { this.loadPlanning(); }
      });
    }
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = {
      'EN_ATTENTE_APPROBATION': 'badge-en-attente',
      'PREVU': 'badge-prevu', 'EN_COURS': 'badge-en-cours',
      'TERMINE': 'badge-termine', 'ANNULE': 'badge-annule'
    };
    return map[statut] ?? '';
  }
}