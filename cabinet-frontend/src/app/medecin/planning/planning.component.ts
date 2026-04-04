import { Component, OnInit } from '@angular/core';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { RendezVous } from '../../shared/models/models';

@Component({
  selector: 'app-planning',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-calendar-alt"></i> Planning</h1>
    </div>

    <div class="card">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" (click)="changeDate(-1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <input type="date" class="form-control" [(ngModel)]="selectedDate"
               (change)="loadPlanning()" style="max-width:200px;">
        <button class="btn btn-outline btn-sm" (click)="changeDate(1)">
          <i class="fas fa-chevron-right"></i>
        </button>
        <button class="btn btn-primary btn-sm" (click)="goToday()">Aujourd'hui</button>
      </div>

      <div class="table-container">
        <table *ngIf="planning.length > 0">
          <thead>
            <tr><th>Heure</th><th>Patient</th><th>Motif</th><th>Durée</th><th>Statut</th><th>Urgent</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let rdv of planning" [style.background]="rdv.urgent ? '#fef2f2' : ''">
              <td><strong>{{ rdv.dateHeure | date:'HH:mm' }}</strong></td>
              <td>
                <a [routerLink]="['/medecin/dossier-patient', rdv.patientId]" style="font-weight:500;">
                  {{ rdv.patientNomComplet }}
                </a>
              </td>
              <td>{{ rdv.motif || '—' }}</td>
              <td>{{ rdv.dureeMinutes }} min</td>
              <td><span class="badge" [ngClass]="getBadge(rdv.statut)">{{ rdv.statut }}</span></td>
              <td><span *ngIf="rdv.urgent" class="badge badge-urgent"><i class="fas fa-exclamation-triangle"></i> Urgent</span></td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="planning.length === 0" style="text-align:center;padding:40px;color:#94a3b8;">
          <i class="fas fa-calendar-times" style="font-size:36px;display:block;margin-bottom:12px;"></i>
          Aucun rendez-vous pour cette journée.
        </p>
      </div>
    </div>
  `
})
export class PlanningComponent implements OnInit {
  selectedDate = '';
  planning: RendezVous[] = [];

  constructor(private rdvService: RendezVousService) {
    this.selectedDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit(): void { this.loadPlanning(); }

  loadPlanning(): void {
    this.rdvService.getPlanning(this.selectedDate).subscribe(list => this.planning = list);
  }

  changeDate(days: number): void {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + days);
    this.selectedDate = d.toISOString().split('T')[0];
    this.loadPlanning();
  }

  goToday(): void {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.loadPlanning();
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = {
      'PREVU': 'badge-prevu', 'EN_COURS': 'badge-en-cours',
      'TERMINE': 'badge-termine', 'ANNULE': 'badge-annule'
    };
    return map[statut] ?? '';
  }
}
