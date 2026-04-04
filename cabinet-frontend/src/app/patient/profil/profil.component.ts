import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { PatientService } from '../../shared/services/patient.service';
import { Patient } from '../../shared/models/models';

@Component({
  selector: 'app-profil',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-user-circle"></i> Mon Profil</h1>
    </div>

    <div class="card" *ngIf="patient">
      <div style="display:flex;align-items:center;gap:24px;margin-bottom:28px;">
        <div style="width:72px;height:72px;border-radius:18px;background:linear-gradient(135deg,#059669,#14b8a6);
                    display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:white;box-shadow:0 4px 14px rgba(5,150,105,0.35);">
          {{ patient.prenom?.charAt(0) }}{{ patient.nom?.charAt(0) }}
        </div>
        <div>
          <h2 style="font-size:20px;font-weight:800;">{{ patient.nomComplet }}</h2>
          <p style="color:#64748b;">{{ patient.email }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Nom</label>
          <input class="form-control" [value]="patient.nom" readonly style="background:#f8fafc;">
        </div>
        <div class="form-group">
          <label>Prénom</label>
          <input class="form-control" [value]="patient.prenom" readonly style="background:#f8fafc;">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>CIN</label>
          <input class="form-control" [value]="patient.cin || '—'" readonly style="background:#f8fafc;">
        </div>
        <div class="form-group">
          <label>Téléphone</label>
          <input class="form-control" [value]="patient.telephone" readonly style="background:#f8fafc;">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Date de naissance</label>
          <input class="form-control" [value]="patient.dateNaissance | date:'dd/MM/yyyy'" readonly style="background:#f8fafc;">
        </div>
        <div class="form-group">
          <label>Sexe</label>
          <input class="form-control" [value]="patient.sexe || '—'" readonly style="background:#f8fafc;">
        </div>
      </div>
      <div class="form-group">
        <label>Adresse</label>
        <input class="form-control" [value]="patient.adresse || '—'" readonly style="background:#f8fafc;">
      </div>
      <div class="form-group">
        <label>Groupe sanguin</label>
        <input class="form-control" [value]="patient.groupeSanguin || '—'" readonly style="background:#f8fafc;">
      </div>
    </div>

    <div *ngIf="!patient" style="text-align:center;padding:40px;color:#94a3b8;">
      <i class="fas fa-spinner fa-spin" style="font-size:32px;"></i>
      <p style="margin-top:12px;">Chargement du profil...</p>
    </div>
  `
})
export class ProfilComponent implements OnInit {
  patient: Patient | null = null;

  constructor(private authService: AuthService, private patientService: PatientService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getByUserId(user.userId).subscribe({
        next: (p) => { this.patient = p; },
        error: () => {
          this.patientService.getAll(0, 100).subscribe(page => {
            this.patient = page.content.find(p => p.email === user.email) ?? null;
          });
        }
      });
    }
  }
}
