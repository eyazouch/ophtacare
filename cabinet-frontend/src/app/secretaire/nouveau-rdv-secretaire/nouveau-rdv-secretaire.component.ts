import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../shared/services/patient.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';
import { Patient } from '../../shared/models/models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nouveau-rdv-secretaire',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-calendar-plus"></i> Nouveau Rendez-vous</h1>
      <a routerLink="/secretaire/gestion-rdv" class="btn btn-outline btn-sm">
        <i class="fas fa-arrow-left"></i> Retour
      </a>
    </div>

    <div class="card">
      <div class="alert alert-danger" *ngIf="errorMessage">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="alert alert-success" *ngIf="successMessage">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>

      <form (ngSubmit)="onSubmit()">

        <!-- Recherche patient -->
        <div class="form-group">
          <label>Patient *</label>
          <div class="search-bar" style="margin-bottom:8px;">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" name="search"
                   (input)="onSearch()" placeholder="Rechercher par nom, prénom...">
          </div>
          <div *ngIf="patients.length > 0 && !selectedPatient"
               style="border:1px solid #e2e8f0;border-radius:10px;max-height:200px;overflow-y:auto;">
            <div *ngFor="let p of patients"
                 (click)="selectPatient(p)"
                 style="padding:12px 16px;cursor:pointer;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:12px;"
                 [style.background]="'white'"
                 onmouseenter="this.style.background='#f0fdf4'"
                 onmouseleave="this.style.background='white'">
              <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#059669,#14b8a6);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;">
                {{ p.prenom?.charAt(0) }}{{ p.nom?.charAt(0) }}
              </div>
              <div>
                <p style="font-weight:600;font-size:14px;">{{ p.nomComplet }}</p>
                <p style="color:#64748b;font-size:12px;">{{ p.telephone }}</p>
              </div>
            </div>
          </div>
          <!-- Patient sélectionné -->
          <div *ngIf="selectedPatient"
               style="background:#f0fdf4;border:1px solid #a7f3d0;border-radius:10px;padding:14px;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#059669,#14b8a6);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;">
                {{ selectedPatient.prenom?.charAt(0) }}{{ selectedPatient.nom?.charAt(0) }}
              </div>
              <div>
                <p style="font-weight:700;color:#065f46;">{{ selectedPatient.nomComplet }}</p>
                <p style="font-size:12px;color:#64748b;">{{ selectedPatient.telephone }}</p>
              </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" (click)="clearPatient()">
              <i class="fas fa-times"></i> Changer
            </button>
          </div>
        </div>

        <!-- Date et créneau -->
        <div class="form-group" *ngIf="selectedPatient">
          <label>Date *</label>
          <input type="date" class="form-control" [(ngModel)]="selectedDate"
                 name="date" (change)="onDateChange()" [min]="minDate" required style="max-width:250px;">
        </div>

        <div *ngIf="loadingCreneaux" style="padding:10px;color:#64748b;">
          <i class="fas fa-spinner fa-spin"></i> Chargement des créneaux...
        </div>

        <div *ngIf="creneaux.length > 0" class="form-group">
          <label>Créneau disponible *</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
            <button type="button" *ngFor="let c of creneaux"
                    class="btn btn-sm"
                    [ngClass]="selectedCreneau === c ? 'btn-primary' : 'btn-outline'"
                    (click)="selectedCreneau = c">
              <i class="fas fa-clock"></i> {{ c }}
            </button>
          </div>
        </div>

        <div *ngIf="selectedDate && creneaux.length === 0 && !loadingCreneaux && selectedPatient"
             class="alert alert-warning">
          Aucun créneau disponible pour cette date.
        </div>

        <!-- Motif -->
        <div class="form-group" *ngIf="selectedCreneau">
          <label>Motif (optionnel)</label>
          <textarea class="form-control" [(ngModel)]="motif" name="motif"
                    placeholder="Ex: Contrôle annuel, urgence..." rows="2"></textarea>
        </div>

        <!-- Résumé -->
        <div *ngIf="selectedCreneau"
             style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:12px;padding:18px;margin-bottom:20px;">
          <h3 style="color:#1e40af;font-size:15px;margin-bottom:10px;">
            <i class="fas fa-check-circle"></i> Résumé
          </h3>
          <p><strong>Patient :</strong> {{ selectedPatient?.nomComplet }}</p>
          <p><strong>Date :</strong> {{ selectedDate }} à {{ selectedCreneau }}</p>
          <p *ngIf="motif"><strong>Motif :</strong> {{ motif }}</p>
        </div>

        <button type="submit" class="btn btn-primary"
                *ngIf="selectedCreneau && selectedPatient"
                [disabled]="loading">
          <i class="fas fa-calendar-check" *ngIf="!loading"></i>
          <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
          {{ loading ? 'Création...' : 'Créer le rendez-vous' }}
        </button>
      </form>
    </div>
  `
})
export class NouveauRdvSecretaireComponent implements OnInit {
  searchQuery = '';
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;

  selectedDate = '';
  minDate = new Date().toISOString().split('T')[0];
  creneaux: string[] = [];
  loadingCreneaux = false;
  selectedCreneau = '';
  motif = '';

  loading = false;
  errorMessage = '';
  successMessage = '';

  rdvId?: number;
  isEditMode = false;

  constructor(
    private patientService: PatientService,
    private rdvService: RendezVousService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.rdvId = this.route.snapshot.params['id'];

    if (this.rdvId) {
      this.isEditMode = true;

      this.rdvService.getById(this.rdvId).subscribe(rdv => {
        this.selectedPatient = {
          id: rdv.patientId,
          nomComplet: rdv.patientNomComplet
        } as any;

        this.selectedDate = rdv.dateHeure.split('T')[0];
        this.selectedCreneau = rdv.dateHeure.split('T')[1]?.substring(0,5);
        this.motif = rdv.motif;
      });
    }
  }

  onSearch(): void {
    if (this.searchQuery.length >= 2) {
      this.patientService.search(this.searchQuery).subscribe({
        next: (res: any) => {
          this.patients = res.content ?? [];
        },
        error: () => { this.patients = []; }
      });
    } else {
      this.patients = [];
    }
  }

  selectPatient(p: Patient): void {
    this.selectedPatient = p;
    this.patients = [];
    this.searchQuery = p.nomComplet;
    this.selectedDate = '';
    this.creneaux = [];
    this.selectedCreneau = '';
  }

  clearPatient(): void {
    this.selectedPatient = null;
    this.searchQuery = '';
    this.patients = [];
    this.selectedDate = '';
    this.creneaux = [];
    this.selectedCreneau = '';
  }

  onDateChange(): void {
    this.selectedCreneau = '';
    this.creneaux = [];
    if (this.selectedDate) {
      this.loadingCreneaux = true;
      this.rdvService.getCreneauxDisponibles(this.selectedDate).subscribe({
        next: (l) => { this.creneaux = l; this.loadingCreneaux = false; },
        error: () => { this.loadingCreneaux = false; }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.selectedPatient || !this.selectedDate || !this.selectedCreneau) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.loading = true;

    const heure = this.selectedCreneau.split(' - ')[0].trim();
    const dateHeure = `${this.selectedDate}T${heure}:00`;

    const payload = {
      patientId: this.selectedPatient.id,
      dateHeure,
      motif: this.motif?.trim() ? this.motif.trim() : undefined,
      dureeMinutes: 30
    };

    // MODE ÉDITION
    if (this.isEditMode) {
      this.rdvService.update(this.rdvId!, payload).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Rendez-vous modifié avec succès !';

          setTimeout(() => {
            this.router.navigate(['/secretaire/gestion-rdv']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la modification.';
        }
      });

      return;
    }

    // MODE CRÉATION
    this.rdvService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Rendez-vous créé avec succès !';

        setTimeout(() => {
          this.router.navigate(['/secretaire/gestion-rdv']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur lors de la création.';
      }
    });
  }
}