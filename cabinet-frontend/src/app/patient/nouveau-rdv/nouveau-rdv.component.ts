import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { PatientService } from '../../shared/services/patient.service';
import { RendezVousService } from '../../shared/services/rendez-vous.service';

@Component({
  selector: 'app-nouveau-rdv',
  template: `
    <div class="page-header">
      <h1><i class="fas fa-calendar-plus"></i> Demande de Rendez-vous</h1>
    </div>

    <div class="card">
      <div class="alert alert-danger" *ngIf="errorMessage">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>
      <div class="alert alert-success" *ngIf="successMessage">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>

      <!-- Debug patientId -->
      <div *ngIf="patientId === 0" class="alert alert-warning">
        <i class="fas fa-exclamation-triangle"></i>
        Profil patient en cours de chargement...
        <button class="btn btn-outline btn-sm" style="margin-left:12px;" (click)="reloadPatient()">
          <i class="fas fa-sync"></i> Recharger
        </button>
      </div>

      <div class="alert alert-warning" style="margin-bottom: 20px;" *ngIf="patientId !== 0">
        <i class="fas fa-info-circle"></i>
        Choisissez <strong>1 ou 2 créneaux</strong> qui vous conviennent.
        La secrétaire approuvera l'un d'eux pour confirmer votre rendez-vous.
      </div>

      <form (ngSubmit)="onSubmit()">

        <!-- Créneau 1 -->
        <div style="background:#f0fdf4;border:1px solid #a7f3d0;border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="font-size:15px;font-weight:700;color:#065f46;margin-bottom:16px;">
            <i class="fas fa-calendar-check" style="margin-right:8px;"></i>Créneau 1 *
          </h3>
          <div class="form-group">
            <label>Date</label>
            <input type="date" class="form-control" [(ngModel)]="date1"
                   name="date1" (change)="onDate1Change()" [min]="minDate" required>
          </div>
          <div *ngIf="loadingCreneaux1" style="padding:10px;color:#64748b;">
            <i class="fas fa-spinner fa-spin"></i> Chargement des créneaux...
          </div>
          <div *ngIf="creneaux1.length > 0">
            <label>Heure</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
              <button type="button" *ngFor="let c of creneaux1"
                      class="btn btn-sm"
                      [ngClass]="creneau1 === c ? 'btn-primary' : 'btn-outline'"
                      (click)="selectCreneau1(c)">
                <i class="fas fa-clock"></i> {{ c }}
              </button>
            </div>
          </div>
          <div *ngIf="date1 && creneaux1.length === 0 && !loadingCreneaux1"
               class="alert alert-warning" style="margin-top:12px;">
            Aucun créneau disponible pour cette date. Essayez une autre date.
          </div>
        </div>

        <!-- Créneau 2 (optionnel) -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:20px;">
          <h3 style="font-size:15px;font-weight:700;color:#334155;margin-bottom:16px;">
            <i class="fas fa-calendar-plus" style="margin-right:8px;"></i>Créneau 2
            <span style="font-size:12px;font-weight:400;color:#94a3b8;margin-left:8px;">(optionnel)</span>
          </h3>
          <div class="form-group">
            <label>Date</label>
            <input type="date" class="form-control" [(ngModel)]="date2"
                   name="date2" (change)="onDate2Change()" [min]="minDate">
          </div>
          <div *ngIf="loadingCreneaux2" style="padding:10px;color:#64748b;">
            <i class="fas fa-spinner fa-spin"></i> Chargement des créneaux...
          </div>
          <div *ngIf="creneaux2.length > 0">
            <label>Heure</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
              <button type="button" *ngFor="let c of creneaux2"
                      class="btn btn-sm"
                      [ngClass]="creneau2 === c ? 'btn-primary' : 'btn-outline'"
                      (click)="selectCreneau2(c)">
                <i class="fas fa-clock"></i> {{ c }}
              </button>
            </div>
          </div>
        </div>

        <!-- Motif -->
        <div class="form-group" *ngIf="creneau1">
          <label>Motif de la consultation (optionnel)</label>
          <textarea class="form-control" [(ngModel)]="motif" name="motif"
                    placeholder="Ex: Contrôle de la vue, douleur oculaire..." rows="3"></textarea>
        </div>

        <!-- Résumé -->
        <div style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px;margin-bottom:20px;"
             *ngIf="creneau1">
          <h3 style="margin-bottom:12px;color:#1e40af;font-size:15px;">
            <i class="fas fa-check-circle"></i> Résumé de votre demande
          </h3>
          <p><strong>Créneau 1 :</strong> {{ date1 }} à {{ creneau1 }}</p>
          <p *ngIf="creneau2"><strong>Créneau 2 :</strong> {{ date2 }} à {{ creneau2 }}</p>
          <p *ngIf="motif"><strong>Motif :</strong> {{ motif }}</p>
          <p style="color:#64748b;font-size:13px;margin-top:8px;">
            <i class="fas fa-info-circle"></i>
            La secrétaire confirmera l'un de ces créneaux.
          </p>
        </div>

        <button type="submit" class="btn btn-primary"
                *ngIf="creneau1"
                [disabled]="loading || patientId === 0">
          <i class="fas fa-paper-plane" *ngIf="!loading"></i>
          <i class="fas fa-spinner fa-spin" *ngIf="loading"></i>
          {{ loading ? 'Envoi en cours...' : 'Envoyer la demande' }}
        </button>

        <p *ngIf="creneau1 && patientId === 0" style="color:#dc2626;font-size:13px;margin-top:8px;">
          <i class="fas fa-exclamation-triangle"></i>
          Le profil patient n'est pas encore chargé. Attendez ou cliquez sur "Recharger" ci-dessus.
        </p>
      </form>
    </div>
  `
})
export class NouveauRdvComponent implements OnInit {
  date1 = ''; creneau1 = ''; creneaux1: string[] = []; loadingCreneaux1 = false;
  date2 = ''; creneau2 = ''; creneaux2: string[] = []; loadingCreneaux2 = false;
  motif = '';
  loading = false;
  errorMessage = '';
  successMessage = '';
  minDate = new Date().toISOString().split('T')[0];
  patientId = 0;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private rdvService: RendezVousService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reloadPatient();
  }

  reloadPatient(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      return;
    }

    // Essai 1 : via userId
    this.patientService.getByUserId(user.userId).subscribe({
      next: (p) => {
        this.patientId = p.id;
        console.log('Patient chargé via userId:', this.patientId);
      },
      error: (err) => {
        console.warn('getByUserId échoué, fallback sur getAll:', err);
        // Essai 2 : fallback via email dans la liste
        this.patientService.getAll(0, 200).subscribe({
          next: (page) => {
            const found = page.content.find(p => p.email === user.email);
            if (found) {
              this.patientId = found.id;
              console.log('Patient chargé via fallback:', this.patientId);
            } else {
              this.errorMessage = 'Profil patient introuvable. Contactez la secrétaire.';
            }
          },
          error: () => {
            this.errorMessage = 'Impossible de charger votre profil. Vérifiez votre connexion.';
          }
        });
      }
    });
  }

  onDate1Change(): void {
    this.creneau1 = '';
    this.creneaux1 = [];
    if (this.date1) {
      this.loadingCreneaux1 = true;
      this.rdvService.getCreneauxDisponibles(this.date1).subscribe({
        next: (l) => { this.creneaux1 = l; this.loadingCreneaux1 = false; },
        error: () => {
          this.loadingCreneaux1 = false;
          this.errorMessage = 'Erreur lors du chargement des créneaux.';
        }
      });
    }
  }

  onDate2Change(): void {
    this.creneau2 = '';
    this.creneaux2 = [];
    if (this.date2) {
      this.loadingCreneaux2 = true;
      this.rdvService.getCreneauxDisponibles(this.date2).subscribe({
        next: (l) => { this.creneaux2 = l; this.loadingCreneaux2 = false; },
        error: () => { this.loadingCreneaux2 = false; }
      });
    }
  }

  selectCreneau1(c: string): void { this.creneau1 = c; }
  selectCreneau2(c: string): void { this.creneau2 = c; }

  buildDateTime(date: string, creneau: string): string {
    const heure = creneau.split(' - ')[0].trim();
    return `${date}T${heure}:00`;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.patientId === 0) {
      this.errorMessage = 'Profil patient non chargé. Cliquez sur Recharger.';
      return;
    }
    if (!this.creneau1 || !this.date1) {
      this.errorMessage = 'Veuillez sélectionner au moins un créneau.';
      return;
    }

    this.loading = true;

    const payload: any = {
      patientId: this.patientId,
      dateHeure: this.buildDateTime(this.date1, this.creneau1),
      motif: this.motif || null,
      dureeMinutes: 30
    };

    if (this.creneau2 && this.date2) {
      payload.dateHeureAlt = this.buildDateTime(this.date2, this.creneau2);
    }

    console.log('Payload RDV:', JSON.stringify(payload));

    this.rdvService.create(payload).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Réponse:', res);
        this.successMessage = 'Demande envoyée avec succès ! La secrétaire va confirmer votre créneau.';
        setTimeout(() => this.router.navigate(['/patient/mes-rdv']), 3000);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur HTTP:', err);
        this.errorMessage = err.error?.message || `Erreur ${err.status}: ${err.statusText}`;
      }
    });
  }
}