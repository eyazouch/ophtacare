import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../shared/services/patient.service';
import { Patient } from '../../shared/models/models';

@Component({
  selector: 'app-gestion-patients',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-users"></i> Gestion des Patients</h1>
      <a routerLink="/secretaire/nouveau-patient" class="btn btn-primary">
        <i class="fas fa-user-plus"></i> Nouveau patient
      </a>
    </div>

    <div class="card">
      <div class="search-bar" style="margin-bottom:20px;">
        <i class="fas fa-search"></i>
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()"
               placeholder="Rechercher par nom, prénom, téléphone...">
      </div>

      <div class="table-container">
        <table *ngIf="patients.length > 0">
          <thead>
            <tr><th>Nom complet</th><th>Téléphone</th><th>CIN</th><th>Date naissance</th><th>RDV</th><th>Analyses</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of patients">
              <td><strong>{{ p.nomComplet }}</strong></td>
              <td>{{ p.telephone }}</td>
              <td>{{ p.cin || '—' }}</td>
              <td>{{ p.dateNaissance | date:'dd/MM/yyyy' }}</td>
              <td><span class="badge badge-prevu">{{ p.nombreRdv || 0 }}</span></td>
              <td><span class="badge badge-examinee">{{ p.nombreAnalyses || 0 }}</span></td>
              <td>
                <a [routerLink]="['/medecin/dossier-patient', p.id]" class="btn btn-outline btn-sm">
                  <i class="fas fa-folder-open"></i> Dossier
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="patients.length === 0" style="text-align:center;padding:40px;color:#94a3b8;">
          <i class="fas fa-users" style="font-size:48px;display:block;margin-bottom:16px;"></i>
          Aucun patient trouvé.
        </div>
      </div>
    </div>
  `
})
export class GestionPatientsComponent implements OnInit {
  patients: Patient[] = [];
  allPatients: Patient[] = [];
  searchQuery = '';

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientService.getAll(0, 200).subscribe(page => {
      this.allPatients = page.content;
      this.patients = page.content;
    });
  }

  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.patients = this.allPatients.filter(p =>
      p.nomComplet?.toLowerCase().includes(q) ||
      p.telephone?.toLowerCase().includes(q) ||
      p.cin?.toLowerCase().includes(q)
    );
  }
}
