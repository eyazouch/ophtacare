import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { PatientService } from '../../shared/services/patient.service';
import { AnalyseService } from '../../shared/services/analyse.service';
import { Analyse } from '../../shared/models/models';

@Component({
  selector: 'app-mes-analyses',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-file-medical"></i> Mes Analyses</h1>
      <a routerLink="/patient/upload-analyse" class="btn btn-primary">
        <i class="fas fa-upload"></i> Déposer une analyse
      </a>
    </div>

    <div class="card">
      <div class="table-container">
        <table *ngIf="analyseList.length > 0">
          <thead>
            <tr><th>Type</th><th>Fichier</th><th>Date dépôt</th><th>Statut</th><th>Avis du médecin</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of analyseList">
              <td><strong>{{ a.typeAnalyse }}</strong></td>
              <td><i class="fas fa-file-pdf" style="color:#dc2626;margin-right:6px;"></i>{{ a.fichierNom }}</td>
              <td>{{ a.dateDepot | date:'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <span class="badge" [ngClass]="getBadge(a.statut)">{{ a.statut }}</span>
                <span *ngIf="a.urgent" class="badge badge-urgent" style="margin-left:6px;">
                  <i class="fas fa-exclamation-triangle"></i> Urgent
                </span>
              </td>
              <td>
                <span *ngIf="a.commentaireMedecin" style="color:#065f46;">
                  <i class="fas fa-comment-medical" style="margin-right:6px;"></i>{{ a.commentaireMedecin }}
                </span>
                <span *ngIf="!a.commentaireMedecin" style="color:#94a3b8;">En attente d'examen...</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="analyseList.length === 0" style="text-align:center;padding:40px;color:#94a3b8;">
          <i class="fas fa-folder-open" style="font-size:48px;display:block;margin-bottom:16px;"></i>
          Aucune analyse déposée pour le moment.
        </div>
      </div>
    </div>
  `
})
export class MesAnalysesComponent implements OnInit {
  analyseList: Analyse[] = [];
  patientId = 0;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private analyseService: AnalyseService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getByUserId(user.userId).subscribe({
        next: (p) => { this.patientId = p.id; this.load(); },
        error: () => {
          this.patientService.getAll(0, 100).subscribe(page => {
            const found = page.content.find(p => p.email === user.email);
            if (found) { this.patientId = found.id; this.load(); }
          });
        }
      });
    }
  }

  load(): void {
    this.analyseService.getByPatient(this.patientId).subscribe(list => this.analyseList = list);
  }

  getBadge(statut: string): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'badge-en-attente', 'EXAMINEE': 'badge-examinee', 'ARCHIVEE': 'badge-termine'
    };
    return map[statut] ?? '';
  }
}
