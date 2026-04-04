import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { PatientService } from '../../shared/services/patient.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { RendezVous } from '../../shared/models/models';

@Component({
  selector: 'app-mes-rdv',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-calendar-alt"></i> Mes Rendez-vous</h1>
      <a routerLink="/patient/nouveau-rdv" class="btn btn-primary">
        <i class="fas fa-plus"></i> Nouveau RDV
      </a>
    </div>

    <div class="alert alert-success" *ngIf="successMessage">{{ successMessage }}</div>

    <div class="card">
      <div class="table-container">
        <table *ngIf="rdvList.length > 0">
          <thead>
            <tr><th>Date & Heure</th><th>Motif</th><th>Durée</th><th>Statut</th><th>Urgent</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let rdv of rdvList" [style.background]="rdv.urgent ? '#fef2f2' : ''">
              <td><strong>{{ rdv.dateHeure | date:'dd/MM/yyyy' }}</strong><br>
                <span style="color:#64748b;">{{ rdv.dateHeure | date:'HH:mm' }}</span>
              </td>
              <td>{{ rdv.motif || 'Consultation générale' }}</td>
              <td>{{ rdv.dureeMinutes }} min</td>
              <td>
                <span class="badge" [ngClass]="getBadge(rdv.statut)">{{ rdv.statut }}</span>
              </td>
              <td>
                <span *ngIf="rdv.urgent" class="badge badge-urgent">
                  <i class="fas fa-exclamation-triangle"></i> Urgent
                </span>
              </td>
              <td>
                <button class="btn btn-danger btn-sm" *ngIf="rdv.statut === 'PREVU'" (click)="annuler(rdv.id)">
                  <i class="fas fa-times"></i> Annuler
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="rdvList.length === 0" style="text-align:center;padding:40px;color:#94a3b8;">
          <i class="fas fa-calendar-times" style="font-size:48px;display:block;margin-bottom:16px;"></i>
          Aucun rendez-vous enregistré.
        </div>
      </div>
    </div>
  `
})
export class MesRdvComponent implements OnInit {
  rdvList: RendezVous[] = [];
  patientId = 0;
  successMessage = '';

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private rdvService: RendezVousService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getByUserId(user.userId).subscribe({
        next: (p) => { this.patientId = p.id; this.loadRdv(); },
        error: () => {
          this.patientService.getAll(0, 100).subscribe(page => {
            const found = page.content.find(p => p.email === user.email);
            if (found) { this.patientId = found.id; this.loadRdv(); }
          });
        }
      });
    }
  }

  loadRdv(): void {
    this.rdvService.getByPatient(this.patientId).subscribe(list => this.rdvList = list);
  }

  annuler(id: number): void {
    if (confirm('Confirmer l\'annulation de ce rendez-vous ?')) {
      this.rdvService.cancel(id).subscribe({
        next: () => {
          this.successMessage = 'Rendez-vous annulé avec succès.';
          this.loadRdv();
          setTimeout(() => this.successMessage = '', 3000);
        }
      });
    }
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = {
      'PREVU': 'badge-prevu', 'EN_COURS': 'badge-en-cours',
      'TERMINE': 'badge-termine', 'ANNULE': 'badge-annule'
    };
    return map[statut] ?? '';
  }
}
