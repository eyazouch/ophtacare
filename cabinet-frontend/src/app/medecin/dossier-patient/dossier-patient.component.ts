import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../shared/services/patient.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { AnalyseService } from '../../shared/services/analyse.service';
import { Patient, RendezVous, Analyse } from '../../shared/models/models';

@Component({
  selector: 'app-dossier-patient',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-folder-open"></i> Dossier Patient</h1>
      <a routerLink="/medecin/planning" class="btn btn-outline btn-sm">
        <i class="fas fa-arrow-left"></i> Retour
      </a>
    </div>

    <div *ngIf="patient" class="card">
      <div style="display:flex;align-items:center;gap:20px;margin-bottom:24px;">
        <div style="width:64px;height:64px;border-radius:16px;background:linear-gradient(135deg,#059669,#14b8a6);
                    display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:white;">
          {{ patient.prenom?.charAt(0) }}{{ patient.nom?.charAt(0) }}
        </div>
        <div>
          <h2 style="font-size:20px;font-weight:800;">{{ patient.nomComplet }}</h2>
          <p style="color:#64748b;">{{ patient.email }} — {{ patient.telephone }}</p>
        </div>
      </div>
      <div class="form-row">
        <div><label style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">Date de naissance</label>
          <p style="font-weight:600;">{{ patient.dateNaissance | date:'dd/MM/yyyy' }}</p></div>
        <div><label style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">CIN</label>
          <p style="font-weight:600;">{{ patient.cin || '—' }}</p></div>
        <div><label style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">Sexe</label>
          <p style="font-weight:600;">{{ patient.sexe || '—' }}</p></div>
        <div><label style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">Groupe sanguin</label>
          <p style="font-weight:600;">{{ patient.groupeSanguin || '—' }}</p></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2><i class="fas fa-calendar-alt"></i> Historique des RDV</h2></div>
      <div class="table-container">
        <table *ngIf="rdvList.length > 0">
          <thead><tr><th>Date</th><th>Motif</th><th>Statut</th><th>Urgent</th><th>Notes médecin</th></tr></thead>
          <tbody>
            <tr *ngFor="let rdv of rdvList">
              <td>{{ rdv.dateHeure | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>{{ rdv.motif || '—' }}</td>
              <td><span class="badge" [ngClass]="getBadge(rdv.statut)">{{ rdv.statut }}</span></td>
              <td><span *ngIf="rdv.urgent" class="badge badge-urgent"><i class="fas fa-exclamation-triangle"></i></span></td>
              <td style="font-style:italic;color:#64748b;">{{ rdv.notesMedecin || '—' }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="rdvList.length === 0" style="text-align:center;padding:20px;color:#94a3b8;">Aucun rendez-vous.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><h2><i class="fas fa-file-medical"></i> Analyses</h2></div>
      <div class="table-container">
        <table *ngIf="analyseList.length > 0">
          <thead><tr><th>Type</th><th>Fichier</th><th>Date dépôt</th><th>Statut</th><th>Avis médecin</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of analyseList">
              <td>{{ a.typeAnalyse }}</td>
              <td>{{ a.fichierNom }}</td>
              <td>{{ a.dateDepot | date:'dd/MM/yyyy' }}</td>
              <td><span class="badge" [ngClass]="getBadgeAnalyse(a.statut)">{{ a.statut }}</span></td>
              <td style="font-style:italic;color:#064e3b;">{{ a.commentaireMedecin || '—' }}</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="analyseList.length === 0" style="text-align:center;padding:20px;color:#94a3b8;">Aucune analyse.</p>
      </div>
    </div>
  `
})
export class DossierPatientComponent implements OnInit {
  patient: Patient | null = null;
  rdvList: RendezVous[] = [];
  analyseList: Analyse[] = [];

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private rdvService: RendezVousService,
    private analyseService: AnalyseService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.patientService.getById(id).subscribe(p => this.patient = p);
    this.rdvService.getByPatient(id).subscribe(list => this.rdvList = list);
    this.analyseService.getByPatient(id).subscribe(list => this.analyseList = list);
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = { 'PREVU': 'badge-prevu', 'EN_COURS': 'badge-en-cours', 'TERMINE': 'badge-termine', 'ANNULE': 'badge-annule' };
    return map[statut] ?? '';
  }

  getBadgeAnalyse(statut: string): string {
    const map: Record<string, string> = { 'EN_ATTENTE': 'badge-en-attente', 'EXAMINEE': 'badge-examinee', 'ARCHIVEE': 'badge-termine' };
    return map[statut] ?? '';
  }
}
