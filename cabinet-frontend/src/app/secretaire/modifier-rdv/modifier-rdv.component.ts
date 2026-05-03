import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RendezVousService } from '../../shared/services/rendez-vous.service';

@Component({
  selector: 'app-modifier-rdv',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-edit"></i> Modifier le Rendez-vous</h1>
      <a routerLink="/secretaire/planning" class="btn btn-outline btn-sm">
        <i class="fas fa-arrow-left"></i> Retour
      </a>
    </div>

    <div class="card" *ngIf="rdv">
      <div class="alert alert-danger" *ngIf="error">{{ error }}</div>
      <div class="alert alert-success" *ngIf="success">{{ success }}</div>

      <p style="margin-bottom:20px;color:#64748b;">
        <i class="fas fa-user"></i> <strong>{{ rdv.patientNomComplet }}</strong>
        &nbsp;—&nbsp; RDV du {{ rdv.dateHeure | date:'dd/MM/yyyy à HH:mm' }}
      </p>

      <div class="form-group">
        <label>Nouvelle date *</label>
        <input type="date" class="form-control" [(ngModel)]="newDate"
               (change)="onDateChange()" [min]="minDate" style="max-width:250px;">
      </div>

      <div *ngIf="loadingCreneaux" style="color:#64748b;">
        <i class="fas fa-spinner fa-spin"></i> Chargement des créneaux...
      </div>

      <div *ngIf="creneaux.length > 0" class="form-group">
        <label>Nouveau créneau *</label>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
          <button type="button" *ngFor="let c of creneaux"
                  class="btn btn-sm"
                  [ngClass]="selectedCreneau === c ? 'btn-primary' : 'btn-outline'"
                  (click)="selectedCreneau = c">
            <i class="fas fa-clock"></i> {{ c }}
          </button>
        </div>
      </div>

      <div *ngIf="newDate && creneaux.length === 0 && !loadingCreneaux"
           class="alert alert-warning">
        Aucun créneau disponible pour cette date.
      </div>

      <button class="btn btn-primary" (click)="onSubmit()"
              [disabled]="!selectedCreneau || loading">
        <i class="fas fa-save" *ngIf="!loading"></i>
        <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
        {{ loading ? 'Sauvegarde...' : 'Enregistrer la modification' }}
      </button>
    </div>

    <div *ngIf="!rdv && !error" style="text-align:center;padding:40px;color:#94a3b8;">
      <i class="fas fa-spinner fa-spin fa-2x"></i>
    </div>
  `
})
export class ModifierRdvComponent implements OnInit {
  rdvId!: number;
  rdv: any = null;
  newDate = '';
  minDate = new Date().toISOString().split('T')[0];
  creneaux: string[] = [];
  loadingCreneaux = false;
  selectedCreneau = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rdvService: RendezVousService
  ) {}

  ngOnInit(): void {
    this.rdvId = +this.route.snapshot.paramMap.get('id')!;
    this.rdvService.getById(this.rdvId).subscribe({
      next: (r) => this.rdv = r,
      error: () => this.error = 'Rendez-vous introuvable.'
    });
  }

  onDateChange(): void {
    this.selectedCreneau = '';
    this.creneaux = [];
    if (!this.newDate) return;
    this.loadingCreneaux = true;
    this.rdvService.getCreneauxDisponibles(this.newDate).subscribe({
      next: (l) => { this.creneaux = l; this.loadingCreneaux = false; },
      error: () => { this.loadingCreneaux = false; }
    });
  }

  onSubmit(): void {
    this.error = '';
    this.loading = true;
    const heure = this.selectedCreneau.split(' - ')[0].trim();
    const dateHeure = `${this.newDate}T${heure}:00`;

    this.rdvService.update(this.rdvId, { dateHeure }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Rendez-vous modifié avec succès !';
        setTimeout(() => this.router.navigate(['/secretaire/planning']), 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de la modification.';
      }
    });
  }
}